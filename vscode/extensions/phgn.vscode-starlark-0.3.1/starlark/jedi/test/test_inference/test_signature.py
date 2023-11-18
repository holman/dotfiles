from textwrap import dedent
from operator import ge, lt
import re

import pytest

from jedi.inference.gradual.conversion import _stub_to_python_value_set


@pytest.mark.parametrize(
    'code, sig, names, op, version', [
        ('import math; math.cos', 'cos(x, /)', ['x'], ge, (2, 7)),

        ('next', 'next(iterator, default=None, /)', ['iterator', 'default'], ge, (2, 7)),

        ('str', "str(object='', /) -> str", ['object'], ge, (2, 7)),

        ('pow', 'pow(x, y, z=None, /) -> number', ['x', 'y', 'z'], lt, (3, 5)),
        ('pow', 'pow(x, y, z=None, /)', ['x', 'y', 'z'], ge, (3, 5)),

        ('bytes.partition', 'partition(self, sep, /) -> (head, sep, tail)', ['self', 'sep'], lt, (3, 5)),
        ('bytes.partition', 'partition(self, sep, /)', ['self', 'sep'], ge, (3, 5)),

        ('bytes().partition', 'partition(sep, /) -> (head, sep, tail)', ['sep'], lt, (3, 5)),
        ('bytes().partition', 'partition(sep, /)', ['sep'], ge, (3, 5)),
    ]
)
def test_compiled_signature(Script, environment, code, sig, names, op, version):
    if not op(environment.version_info, version):
        return  # The test right next to it should take over.

    d, = Script(code).goto_definitions()
    value, = d._name.infer()
    compiled, = _stub_to_python_value_set(value)
    signature, = compiled.get_signatures()
    assert signature.to_string() == sig
    assert [n.string_name for n in signature.get_param_names()] == names


classmethod_code = '''
class X:
    @classmethod
    def x(cls, a, b):
        pass

    @staticmethod
    def static(a, b):
        pass
'''


partial_code = '''
import functools

def func(a, b, c):
    pass

a = functools.partial(func)
b = functools.partial(func, 1)
c = functools.partial(func, 1, c=2)
d = functools.partial()
'''


@pytest.mark.parametrize(
    'code, expected', [
        ('def f(a, * args, x): pass\n f(', 'f(a, *args, x)'),
        ('def f(a, *, x): pass\n f(', 'f(a, *, x)'),
        ('def f(*, x= 3,**kwargs): pass\n f(', 'f(*, x=3, **kwargs)'),
        ('def f(x,/,y,* ,z): pass\n f(', 'f(x, /, y, *, z)'),
        ('def f(a, /, *, x=3, **kwargs): pass\n f(', 'f(a, /, *, x=3, **kwargs)'),

        (classmethod_code + 'X.x(', 'x(cls, a, b)'),
        (classmethod_code + 'X().x(', 'x(cls, a, b)'),
        (classmethod_code + 'X.static(', 'static(a, b)'),
        (classmethod_code + 'X().static(', 'static(a, b)'),

        (partial_code + 'a(', 'func(a, b, c)'),
        (partial_code + 'b(', 'func(b, c)'),
        (partial_code + 'c(', 'func(b)'),
        (partial_code + 'd(', None),
    ]
)
def test_tree_signature(Script, environment, code, expected):
    # Only test this in the latest version, because of /
    if environment.version_info < (3, 8):
        pytest.skip()

    if expected is None:
        assert not Script(code).call_signatures()
    else:
        sig, = Script(code).call_signatures()
        assert expected == sig.to_string()


@pytest.mark.parametrize(
    'combination, expected', [
        # Functions
        ('full_redirect(simple)', 'b, *, c'),
        ('full_redirect(simple4)', 'b, x: int'),
        ('full_redirect(a)', 'b, *args'),
        ('full_redirect(kw)', 'b, *, c, **kwargs'),
        ('full_redirect(akw)', 'c, *args, **kwargs'),

        # Non functions
        ('full_redirect(lambda x, y: ...)', 'y'),
        ('full_redirect()', '*args, **kwargs'),
        ('full_redirect(1)', '*args, **kwargs'),

        # Classes / inheritance
        ('full_redirect(C)', 'z, *, c'),
        ('full_redirect(C())', 'y'),
        ('D', 'D(a, z, /)'),
        ('D()', 'D(x, y)'),
        ('D().foo', 'foo(a, *, bar, z, **kwargs)'),

        # Merging
        ('two_redirects(simple, simple)', 'a, b, *, c'),
        ('two_redirects(simple2, simple2)', 'x'),
        ('two_redirects(akw, kw)', 'a, c, *args, **kwargs'),
        ('two_redirects(kw, akw)', 'a, b, *args, c, **kwargs'),

        ('combined_redirect(simple, simple2)', 'a, b, /, *, x'),
        ('combined_redirect(simple, simple3)', 'a, b, /, *, a, x: int'),
        ('combined_redirect(simple2, simple)', 'x, /, *, a, b, c'),
        ('combined_redirect(simple3, simple)', 'a, x: int, /, *, a, b, c'),

        ('combined_redirect(simple, kw)', 'a, b, /, *, a, b, c, **kwargs'),
        ('combined_redirect(kw, simple)', 'a, b, /, *, a, b, c'),

        ('combined_lot_of_args(kw, simple4)', '*, b'),
        ('combined_lot_of_args(simple4, kw)', '*, b, c, **kwargs'),

        ('combined_redirect(combined_redirect(simple2, simple4), combined_redirect(kw, simple5))',
         'x, /, *, y'),
        ('combined_redirect(combined_redirect(simple4, simple2), combined_redirect(simple5, kw))',
         'a, b, x: int, /, *, a, b, c, **kwargs'),
        ('combined_redirect(combined_redirect(a, kw), combined_redirect(kw, simple5))',
         'a, b, /, *args, y'),

        ('no_redirect(kw)', '*args, **kwargs'),
        ('no_redirect(akw)', '*args, **kwargs'),
        ('no_redirect(simple)', '*args, **kwargs'),
    ]
)
def test_nested_signatures(Script, environment, combination, expected, skip_pre_python35):
    code = dedent('''
        def simple(a, b, *, c): ...
        def simple2(x): ...
        def simple3(a, x: int): ...
        def simple4(a, b, x: int): ...
        def simple5(y): ...
        def a(a, b, *args): ...
        def kw(a, b, *, c, **kwargs): ...
        def akw(a, c, *args, **kwargs): ...

        def no_redirect(func):
            return lambda *args, **kwargs: func(1)
        def full_redirect(func):
            return lambda *args, **kwargs: func(1, *args, **kwargs)
        def two_redirects(func1, func2):
            return lambda *args, **kwargs: func1(*args, **kwargs) + func2(1, *args, **kwargs)
        def combined_redirect(func1, func2):
            return lambda *args, **kwargs: func1(*args) + func2(**kwargs)
        def combined_lot_of_args(func1, func2):
            return lambda *args, **kwargs: func1(1, 2, 3, 4, *args) + func2(a=3, x=1, y=1, **kwargs)

        class C:
            def __init__(self, a, z, *, c): ...
            def __call__(self, x, y): ...

            def foo(self, bar, z, **kwargs): ...

        class D(C):
            def __init__(self, *args):
                super().__init__(*args)

            def foo(self, a, **kwargs):
                super().foo(**kwargs)
    ''')
    code += 'z = ' + combination + '\nz('
    sig, = Script(code).call_signatures()
    computed = sig.to_string()
    if not re.match(r'\w+\(', expected):
        expected = '<lambda>(' + expected + ')'
    assert expected == computed


def test_pow_signature(Script):
    # See github #1357
    sigs = Script('pow(').call_signatures()
    strings = {sig.to_string() for sig in sigs}
    assert strings == {'pow(x: float, y: float, z: float, /) -> float',
                       'pow(x: float, y: float, /) -> float',
                       'pow(x: int, y: int, z: int, /) -> Any',
                       'pow(x: int, y: int, /) -> Any'}


@pytest.mark.parametrize(
    'code, signature', [
        [dedent('''
            import functools
            def f(x):
                pass
            def x(f):
                @functools.wraps(f)
                def wrapper(*args):
                    # Have no arguments here, but because of wraps, the signature
                    # should still be f's.
                    return f(*args)
                return wrapper

            x(f)('''), 'f(x, /)'],
        [dedent('''
            import functools
            def f(x):
                pass
            def x(f):
                @functools.wraps(f)
                def wrapper():
                    # Have no arguments here, but because of wraps, the signature
                    # should still be f's.
                    return 1
                return wrapper

            x(f)('''), 'f()'],
    ]
)
def test_wraps_signature(Script, code, signature, skip_pre_python35):
    sigs = Script(code).call_signatures()
    assert {sig.to_string() for sig in sigs} == {signature}


@pytest.mark.parametrize(
    'start, start_params', [
        ['@dataclass\nclass X:', []],
        ['@dataclass(eq=True)\nclass X:', []],
        [dedent('''
         class Y():
             y: int
         @dataclass
         class X(Y):'''), []],
        [dedent('''
         @dataclass
         class Y():
             y: int
             z = 5
         @dataclass
         class X(Y):'''), ['y']],
    ]
)
def test_dataclass_signature(Script, skip_pre_python37, start, start_params):
    code = dedent('''
            name: str
            foo = 3
            price: float
            quantity: int = 0.0

        X(''')

    code = 'from dataclasses import dataclass\n' + start + code

    sig, = Script(code).call_signatures()
    assert [p.name for p in sig.params] == start_params + ['name', 'price', 'quantity']
    quantity, = sig.params[-1].infer()
    assert quantity.name == 'int'
    price, = sig.params[-2].infer()
    assert price.name == 'float'


@pytest.mark.parametrize(
    'stmt, expected', [
        ('args = 1', 'wrapped(*args, b, c)'),
        ('args = (1,)', 'wrapped(*args, c)'),
        ('kwargs = 1', 'wrapped(b, /, **kwargs)'),
        ('kwargs = dict(b=3)', 'wrapped(b, /, **kwargs)'),
    ]
)
def test_param_resolving_to_static(Script, stmt, expected, skip_pre_python35):
    code = dedent('''\
        def full_redirect(func):
            def wrapped(*args, **kwargs):
                {stmt}
                return func(1, *args, **kwargs)
            return wrapped
        def simple(a, b, *, c): ...
        full_redirect(simple)('''.format(stmt=stmt))

    sig, = Script(code).call_signatures()
    assert sig.to_string() == expected
