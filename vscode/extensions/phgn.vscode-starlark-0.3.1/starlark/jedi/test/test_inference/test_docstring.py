"""
Testing of docstring related issues and especially ``jedi.docstrings``.
"""

from textwrap import dedent
import jedi
import pytest
from ..helpers import unittest
import sys

try:
    import numpydoc  # NOQA
except ImportError:
    numpydoc_unavailable = True
else:
    numpydoc_unavailable = False

try:
    import numpy  # NOQA
except ImportError:
    numpy_unavailable = True
else:
    numpy_unavailable = False

if sys.version_info.major == 2:
    # In Python 2 there's an issue with tox/docutils that makes the tests fail,
    # Python 2 is soon end-of-life, so just don't support numpydoc for it anymore.
    numpydoc_unavailable = True


def test_function_doc(Script):
    defs = Script("""
    def func():
        '''Docstring of `func`.'''
    func""").goto_definitions()
    assert defs[0].docstring() == 'func()\n\nDocstring of `func`.'


def test_class_doc(Script):
    defs = Script("""
    class TestClass():
        '''Docstring of `TestClass`.'''
    TestClass""").goto_definitions()

    expected = 'Docstring of `TestClass`.'
    assert defs[0].docstring(raw=True) == expected
    assert defs[0].docstring() == 'TestClass()\n\n' + expected


def test_class_doc_with_init(Script):
    d, = Script("""
    class TestClass():
        '''Docstring'''
        def __init__(self, foo, bar=3): pass
    TestClass""").goto_definitions()

    assert d.docstring() == 'TestClass(foo, bar=3)\n\nDocstring'


def test_instance_doc(Script):
    defs = Script("""
    class TestClass():
        '''Docstring of `TestClass`.'''
    tc = TestClass()
    tc""").goto_definitions()
    assert defs[0].docstring() == 'Docstring of `TestClass`.'


@unittest.skip('need inference_state class for that')
def test_attribute_docstring(Script):
    defs = Script("""
    x = None
    '''Docstring of `x`.'''
    x""").goto_definitions()
    assert defs[0].docstring() == 'Docstring of `x`.'


@unittest.skip('need inference_state class for that')
def test_multiple_docstrings(Script):
    defs = Script("""
    def func():
        '''Original docstring.'''
    x = func
    '''Docstring of `x`.'''
    x""").goto_definitions()
    docs = [d.docstring() for d in defs]
    assert docs == ['Original docstring.', 'Docstring of `x`.']


def test_completion(Script):
    assert Script('''
    class DocstringCompletion():
        #? []
        """ asdfas """''').completions()


def test_docstrings_type_dotted_import(Script):
    s = """
            def func(arg):
                '''
                :type arg: random.Random
                '''
                arg."""
    names = [c.name for c in Script(s).completions()]
    assert 'seed' in names


def test_docstrings_param_type(Script):
    s = """
            def func(arg):
                '''
                :param str arg: some description
                '''
                arg."""
    names = [c.name for c in Script(s).completions()]
    assert 'join' in names


def test_docstrings_type_str(Script):
    s = """
            def func(arg):
                '''
                :type arg: str
                '''
                arg."""

    names = [c.name for c in Script(s).completions()]
    assert 'join' in names


def test_docstring_instance(Script):
    # The types hint that it's a certain kind
    s = dedent("""
        class A:
            def __init__(self,a):
                '''
                :type a: threading.Thread
                '''

                if a is not None:
                    a.start()

                self.a = a


        def method_b(c):
            '''
            :type c: A
            '''

            c.""")

    names = [c.name for c in Script(s).completions()]
    assert 'a' in names
    assert '__init__' in names
    assert 'mro' not in names  # Exists only for types.


def test_docstring_keyword(Script):
    completions = Script('assert').completions()
    assert 'assert' in completions[0].docstring()


def test_docstring_params_formatting(Script):
    defs = Script("""
    def func(param1,
             param2,
             param3):
        pass
    func""").goto_definitions()
    assert defs[0].docstring() == 'func(param1, param2, param3)'


# ---- Numpy Style Tests ---

@pytest.mark.skipif(numpydoc_unavailable,
                    reason='numpydoc module is unavailable')
def test_numpydoc_parameters():
    s = dedent('''
    def foobar(x, y):
        """
        Parameters
        ----------
        x : int
        y : str
        """
        y.''')
    names = [c.name for c in jedi.Script(s).completions()]
    assert 'isupper' in names
    assert 'capitalize' in names


@pytest.mark.skipif(numpydoc_unavailable,
                    reason='numpydoc module is unavailable')
def test_numpydoc_parameters_set_of_values():
    s = dedent('''
    def foobar(x, y):
        """
        Parameters
        ----------
        x : {'foo', 'bar', 100500}, optional
        """
        x.''')
    names = [c.name for c in jedi.Script(s).completions()]
    assert 'isupper' in names
    assert 'capitalize' in names
    assert 'numerator' in names


@pytest.mark.skipif(numpydoc_unavailable,
                    reason='numpydoc module is unavailable')
def test_numpydoc_parameters_alternative_types():
    s = dedent('''
    def foobar(x, y):
        """
        Parameters
        ----------
        x : int or str or list
        """
        x.''')
    names = [c.name for c in jedi.Script(s).completions()]
    assert 'isupper' in names
    assert 'capitalize' in names
    assert 'numerator' in names
    assert 'append' in names


@pytest.mark.skipif(numpydoc_unavailable,
                    reason='numpydoc module is unavailable')
def test_numpydoc_invalid():
    s = dedent('''
    def foobar(x, y):
        """
        Parameters
        ----------
        x : int (str, py.path.local
        """
        x.''')

    assert not jedi.Script(s).completions()


@pytest.mark.skipif(numpydoc_unavailable,
                    reason='numpydoc module is unavailable')
def test_numpydoc_returns():
    s = dedent('''
    def foobar():
        """
        Returns
        ----------
        x : int
        y : str
        """
        return x

    def bazbiz():
        z = foobar()
        z.''')
    names = [c.name for c in jedi.Script(s).completions()]
    assert 'isupper' in names
    assert 'capitalize' in names
    assert 'numerator' in names


@pytest.mark.skipif(numpydoc_unavailable,
                    reason='numpydoc module is unavailable')
def test_numpydoc_returns_set_of_values():
    s = dedent('''
    def foobar():
        """
        Returns
        ----------
        x : {'foo', 'bar', 100500}
        """
        return x

    def bazbiz():
        z = foobar()
        z.''')
    names = [c.name for c in jedi.Script(s).completions()]
    assert 'isupper' in names
    assert 'capitalize' in names
    assert 'numerator' in names


@pytest.mark.skipif(numpydoc_unavailable,
                    reason='numpydoc module is unavailable')
def test_numpydoc_returns_alternative_types():
    s = dedent('''
    def foobar():
        """
        Returns
        ----------
        int or list of str
        """
        return x

    def bazbiz():
        z = foobar()
        z.''')
    names = [c.name for c in jedi.Script(s).completions()]
    assert 'isupper' not in names
    assert 'capitalize' not in names
    assert 'numerator' in names
    assert 'append' in names


@pytest.mark.skipif(numpydoc_unavailable,
                    reason='numpydoc module is unavailable')
def test_numpydoc_returns_list_of():
    s = dedent('''
    def foobar():
        """
        Returns
        ----------
        list of str
        """
        return x

    def bazbiz():
        z = foobar()
        z.''')
    names = [c.name for c in jedi.Script(s).completions()]
    assert 'append' in names
    assert 'isupper' not in names
    assert 'capitalize' not in names


@pytest.mark.skipif(numpydoc_unavailable,
                    reason='numpydoc module is unavailable')
def test_numpydoc_returns_obj():
    s = dedent('''
    def foobar(x, y):
        """
        Returns
        ----------
        int or random.Random
        """
        return x + y

    def bazbiz():
        z = foobar(x, y)
        z.''')
    script = jedi.Script(s)
    names = [c.name for c in script.completions()]
    assert 'numerator' in names
    assert 'seed' in names


@pytest.mark.skipif(numpydoc_unavailable,
                    reason='numpydoc module is unavailable')
def test_numpydoc_yields():
    s = dedent('''
    def foobar():
        """
        Yields
        ----------
        x : int
        y : str
        """
        return x

    def bazbiz():
        z = foobar():
        z.''')
    names = [c.name for c in jedi.Script(s).completions()]
    assert 'isupper' in names
    assert 'capitalize' in names
    assert 'numerator' in names


@pytest.mark.skipif(numpydoc_unavailable or numpy_unavailable,
                    reason='numpydoc or numpy module is unavailable')
def test_numpy_returns():
    s = dedent('''
        import numpy
        x = numpy.asarray([])
        x.d'''
    )
    names = [c.name for c in jedi.Script(s).completions()]
    assert 'diagonal' in names


@pytest.mark.skipif(numpydoc_unavailable or numpy_unavailable,
                    reason='numpydoc or numpy module is unavailable')
def test_numpy_comp_returns():
    s = dedent('''
        import numpy
        x = numpy.array([])
        x.d'''
    )
    names = [c.name for c in jedi.Script(s).completions()]
    assert 'diagonal' in names


def test_decorator(Script):
    code = dedent('''
        def decorator(name=None):
            def _decorate(func):
                @wraps(func)
                def wrapper(*args, **kwargs):
                    """wrapper docstring"""
                    return func(*args, **kwargs)
                return wrapper
            return _decorate


        @decorator('testing')
        def check_user(f):
            """Nice docstring"""
            pass

        check_user''')

    d, = Script(code).goto_definitions()
    assert d.docstring(raw=True) == 'Nice docstring'
