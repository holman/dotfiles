"""
Tests of ``jedi.api.Interpreter``.
"""
import sys

import pytest

import jedi
from jedi._compatibility import is_py3, py_version
from jedi.inference.compiled import mixed, value
from importlib import import_module

if py_version > 30:
    def exec_(source, global_map):
        exec(source, global_map)
else:
    eval(compile("""def exec_(source, global_map):
                        exec source in global_map """, 'blub', 'exec'))


class _GlobalNameSpace:
    class SideEffectContainer:
        pass


def get_completion(source, namespace):
    i = jedi.Interpreter(source, [namespace])
    completions = i.completions()
    assert len(completions) == 1
    return completions[0]


def test_builtin_details():
    import keyword

    class EmptyClass:
        pass

    variable = EmptyClass()

    def func():
        pass

    cls = get_completion('EmptyClass', locals())
    var = get_completion('variable', locals())
    f = get_completion('func', locals())
    m = get_completion('keyword', locals())
    assert cls.type == 'class'
    assert var.type == 'instance'
    assert f.type == 'function'
    assert m.type == 'module'


def test_numpy_like_non_zero():
    """
    Numpy-like array can't be caster to bool and need to be compacre with
    `is`/`is not` and not `==`/`!=`
    """

    class NumpyNonZero:

        def __zero__(self):
            raise ValueError('Numpy arrays would raise and tell you to use .any() or all()')
        def __bool__(self):
            raise ValueError('Numpy arrays would raise and tell you to use .any() or all()')

    class NumpyLike:

        def __eq__(self, other):
            return NumpyNonZero()

        def something(self):
            pass

    x = NumpyLike()
    d = {'a': x}

    # just assert these do not raise. They (strangely) trigger different
    # codepath
    get_completion('d["a"].some', {'d':d})
    get_completion('x.some', {'x':x})


def test_nested_resolve():
    class XX:
        def x():
            pass

    cls = get_completion('XX', locals())
    func = get_completion('XX.x', locals())
    assert (func.line, func.column) == (cls.line + 1, 12)


def test_side_effect_completion():
    """
    In the repl it's possible to cause side effects that are not documented in
    Python code, however we want references to Python code as well. Therefore
    we need some mixed kind of magic for tests.
    """
    _GlobalNameSpace.SideEffectContainer.foo = 1
    side_effect = get_completion('SideEffectContainer', _GlobalNameSpace.__dict__)

    # It's a class that contains MixedObject.
    value, = side_effect._name.infer()
    assert isinstance(value, mixed.MixedObject)
    foo = get_completion('SideEffectContainer.foo', _GlobalNameSpace.__dict__)
    assert foo.name == 'foo'


def _assert_interpreter_complete(source, namespace, completions,
                                 **kwds):
    script = jedi.Interpreter(source, [namespace], **kwds)
    cs = script.completions()
    actual = [c.name for c in cs]
    assert sorted(actual) == sorted(completions)


def test_complete_raw_function():
    from os.path import join
    _assert_interpreter_complete('join("").up',
                                 locals(),
                                 ['upper'])


def test_complete_raw_function_different_name():
    from os.path import join as pjoin
    _assert_interpreter_complete('pjoin("").up',
                                 locals(),
                                 ['upper'])


def test_complete_raw_module():
    import os
    _assert_interpreter_complete('os.path.join("a").up',
                                 locals(),
                                 ['upper'])


def test_complete_raw_instance():
    import datetime
    dt = datetime.datetime(2013, 1, 1)
    completions = ['time', 'timetz', 'timetuple']
    if is_py3:
        completions += ['timestamp']
    _assert_interpreter_complete('(dt - dt).ti',
                                 locals(),
                                 completions)


def test_list():
    array = ['haha', 1]
    _assert_interpreter_complete('array[0].uppe',
                                 locals(),
                                 ['upper'])
    _assert_interpreter_complete('array[0].real',
                                 locals(),
                                 [])

    # something different, no index given, still just return the right
    _assert_interpreter_complete('array[int].real',
                                 locals(),
                                 ['real'])
    _assert_interpreter_complete('array[int()].real',
                                 locals(),
                                 ['real'])
    # inexistent index
    _assert_interpreter_complete('array[2].upper',
                                 locals(),
                                 ['upper'])


def test_getattr():
    class Foo1:
        bar = []
    baz = 'bar'
    _assert_interpreter_complete('getattr(Foo1, baz).app', locals(), ['append'])


def test_slice():
    class Foo1:
        bar = []
    baz = 'xbarx'
    _assert_interpreter_complete('getattr(Foo1, baz[1:-1]).append',
                                 locals(),
                                 ['append'])


def test_getitem_side_effects():
    class Foo2:
        def __getitem__(self, index):
            # Possible side effects here, should therefore not call this.
            if True:
                raise NotImplementedError()
            return index

    foo = Foo2()
    _assert_interpreter_complete('foo["asdf"].upper', locals(), ['upper'])


@pytest.fixture(params=[False, True])
def allow_descriptor_access_or_not(request, monkeypatch):
    monkeypatch.setattr(jedi.Interpreter, '_allow_descriptor_getattr_default', request.param)
    return request.param


def test_property_error_oldstyle(allow_descriptor_access_or_not):
    lst = []
    class Foo3:
        @property
        def bar(self):
            lst.append(1)
            raise ValueError

    foo = Foo3()
    _assert_interpreter_complete('foo.bar', locals(), ['bar'])
    _assert_interpreter_complete('foo.bar.baz', locals(), [])

    if allow_descriptor_access_or_not:
        assert lst == [1, 1]
    else:
        # There should not be side effects
        assert lst == []


def test_property_error_newstyle(allow_descriptor_access_or_not):
    lst = []
    class Foo3(object):
        @property
        def bar(self):
            lst.append(1)
            raise ValueError

    foo = Foo3()
    _assert_interpreter_complete('foo.bar', locals(), ['bar'])
    _assert_interpreter_complete('foo.bar.baz', locals(), [])

    if allow_descriptor_access_or_not:
        assert lst == [1, 1]
    else:
        # There should not be side effects
        assert lst == []


def test_property_content():
    class Foo3(object):
        @property
        def bar(self):
            return 1

    foo = Foo3()
    def_, = jedi.Interpreter('foo.bar', [locals()]).goto_definitions()
    assert def_.name == 'int'


@pytest.mark.skipif(sys.version_info[0] == 2, reason="Ignore Python 2, because EOL")
def test_param_completion():
    def foo(bar):
        pass

    lambd = lambda xyz: 3

    _assert_interpreter_complete('foo(bar', locals(), ['bar'])
    assert bool(jedi.Interpreter('lambd(xyz', [locals()]).completions()) == is_py3


def test_endless_yield():
    lst = [1] * 10000
    # If iterating over lists it should not be possible to take an extremely
    # long time.
    _assert_interpreter_complete('list(lst)[9000].rea', locals(), ['real'])


@pytest.mark.skipif('py_version < 33', reason='inspect.signature was created in 3.3.')
def test_completion_params():
    foo = lambda a, b=3: None

    script = jedi.Interpreter('foo', [locals()])
    c, = script.completions()
    assert [p.name for p in c.params] == ['a', 'b']
    assert c.params[0].infer() == []
    t, = c.params[1].infer()
    assert t.name == 'int'


@pytest.mark.skipif('py_version < 33', reason='inspect.signature was created in 3.3.')
def test_completion_param_annotations():
    # Need to define this function not directly in Python. Otherwise Jedi is to
    # clever and uses the Python code instead of the signature object.
    code = 'def foo(a: 1, b: str, c: int = 1.0) -> bytes: pass'
    exec_(code, locals())
    script = jedi.Interpreter('foo', [locals()])
    c, = script.completions()
    a, b, c = c.params
    assert a.infer() == []
    assert [d.name for d in b.infer()] == ['str']
    assert {d.name for d in c.infer()} == {'int', 'float'}

    d, = jedi.Interpreter('foo()', [locals()]).goto_definitions()
    assert d.name == 'bytes'


@pytest.mark.skipif(sys.version_info[0] == 2, reason="Ignore Python 2, because EOL")
def test_keyword_argument():
    def f(some_keyword_argument):
        pass

    c, = jedi.Interpreter("f(some_keyw", [{'f': f}]).completions()
    assert c.name == 'some_keyword_argument'
    assert c.complete == 'ord_argument='

    # This needs inspect.signature to work.
    if is_py3:
        # Make it impossible for jedi to find the source of the function.
        f.__name__ = 'xSOMETHING'
        c, = jedi.Interpreter("x(some_keyw", [{'x': f}]).completions()
        assert c.name == 'some_keyword_argument'


def test_more_complex_instances():
    class Something:
        def foo(self, other):
            return self

    class Base:
        def wow(self):
            return Something()

    #script = jedi.Interpreter('Base().wow().foo', [locals()])
    #c, = script.completions()
    #assert c.name == 'foo'

    x = Base()
    script = jedi.Interpreter('x.wow().foo', [locals()])
    c, = script.completions()
    assert c.name == 'foo'


def test_repr_execution_issue():
    """
    Anticipate inspect.getfile executing a __repr__ of all kinds of objects.
    See also #919.
    """
    class ErrorRepr:
        def __repr__(self):
            raise Exception('xyz')

    er = ErrorRepr()

    script = jedi.Interpreter('er', [locals()])
    d, = script.goto_definitions()
    assert d.name == 'ErrorRepr'
    assert d.type == 'instance'


def test_dir_magic_method():
    class CompleteAttrs(object):
        def __getattr__(self, name):
            if name == 'foo':
                return 1
            if name == 'bar':
                return 2
            raise AttributeError(name)

        def __dir__(self):
            if is_py3:
                names = object.__dir__(self)
            else:
                names = dir(object())
            return ['foo', 'bar'] + names

    itp = jedi.Interpreter("ca.", [{'ca': CompleteAttrs()}])
    completions = itp.completions()
    names = [c.name for c in completions]
    assert ('__dir__' in names) == is_py3
    assert '__class__' in names
    assert 'foo' in names
    assert 'bar' in names

    foo = [c for c in completions if c.name == 'foo'][0]
    assert foo.infer() == []


def test_name_not_findable():
    class X():
        if 0:
            NOT_FINDABLE

        def hidden(self):
            return

        hidden.__name__ = 'NOT_FINDABLE'

    setattr(X, 'NOT_FINDABLE', X.hidden)

    assert jedi.Interpreter("X.NOT_FINDA", [locals()]).completions()


def test_stubs_working():
    from multiprocessing import cpu_count
    defs = jedi.Interpreter("cpu_count()", [locals()]).goto_definitions()
    assert [d.name for d in defs] == ['int']


def test_sys_path_docstring():  # Was an issue in #1298
    import jedi
    s = jedi.Interpreter("from sys import path\npath", line=2, column=4, namespaces=[locals()])
    s.completions()[0].docstring()


@pytest.mark.skipif(sys.version_info[0] == 2, reason="Ignore Python 2, because EOL")
@pytest.mark.parametrize(
    'code, completions', [
        ('x[0].uppe', ['upper']),
        ('x[1337].uppe', ['upper']),
        ('x[""].uppe', ['upper']),
        ('x.appen', ['append']),

        ('y.add', ['add']),
        ('y[0].', []),
        ('list(y)[0].', []),  # TODO use stubs properly to improve this.

        ('z[0].uppe', ['upper']),
        ('z[0].append', ['append']),
        ('z[1].uppe', ['upper']),
        ('z[1].append', []),

        ('collections.deque().app', ['append', 'appendleft']),
        ('deq.app', ['append', 'appendleft']),
        ('deq.pop', ['pop', 'popleft']),
        ('deq.pop().', []),

        ('collections.Counter("asdf").setdef', ['setdefault']),
        ('collections.Counter("asdf").pop().imag', ['imag']),
        ('list(collections.Counter("asdf").keys())[0].uppe', ['upper']),
        ('counter.setdefa', ['setdefault']),
        ('counter.pop().imag', []),  # TODO stubs could make this better
        ('counter.keys())[0].uppe', []),

        ('string.upper().uppe', ['upper']),
        ('"".upper().uppe', ['upper']),
    ]
)
def test_simple_completions(code, completions):
    x = [str]
    y = {1}
    z = {1: str, 2: list}
    import collections
    deq = collections.deque([1])
    counter = collections.Counter(['asdf'])
    string = ''

    defs = jedi.Interpreter(code, [locals()]).completions()
    assert [d.name for d in defs] == completions


@pytest.mark.skipif(sys.version_info[0] == 2, reason="Python 2 doesn't have lru_cache")
def test__wrapped__():
    from functools import lru_cache

    @lru_cache(maxsize=128)
    def syslogs_to_df():
            pass

    c, = jedi.Interpreter('syslogs_to_df', [locals()]).completions()
    # Apparently the function starts on the line where the decorator starts.
    assert c.line == syslogs_to_df.__wrapped__.__code__.co_firstlineno + 1


@pytest.mark.parametrize('module_name', ['sys', 'time'])
def test_core_module_completes(module_name):
    module = import_module(module_name)
    assert jedi.Interpreter(module_name + '.\n', [locals()]).completions()


@pytest.mark.skipif(sys.version_info[0] == 2, reason="Ignore Python 2, because EOL")
@pytest.mark.parametrize(
    'code, expected, index', [
        ('a(', ['a', 'b', 'c'], 0),
        ('b(', ['b', 'c'], 0),
        # Might or might not be correct, because c is given as a keyword
        # argument as well, but that is just what inspect.signature returns.
        ('c(', ['b', 'c'], 0),
    ]
)
def test_partial_signatures(code, expected, index):
    import functools

    def func(a, b, c):
        pass

    a = functools.partial(func)
    b = functools.partial(func, 1)
    c = functools.partial(func, 1, c=2)

    sig, = jedi.Interpreter(code, [locals()]).call_signatures()
    assert sig.name == 'partial'
    assert [p.name for p in sig.params] == expected
    assert index == sig.index


@pytest.mark.skipif(sys.version_info[0] == 2, reason="Ignore Python 2, because EOL")
def test_type_var():
    """This was an issue before, see Github #1369"""
    import typing
    x = typing.TypeVar('myvar')
    def_, = jedi.Interpreter('x', [locals()]).goto_definitions()
    assert def_.name == 'TypeVar'
