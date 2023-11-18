"""
Testing if parso finds syntax errors and indentation errors.
"""
import sys
import warnings

import pytest

import parso
from parso._compatibility import is_pypy
from .failing_examples import FAILING_EXAMPLES, indent, build_nested


if is_pypy:
    # The errors in PyPy might be different. Just skip the module for now.
    pytestmark = pytest.mark.skip()


def _get_error_list(code, version=None):
    grammar = parso.load_grammar(version=version)
    tree = grammar.parse(code)
    return list(grammar.iter_errors(tree))


def assert_comparison(code, error_code, positions):
    errors = [(error.start_pos, error.code) for error in _get_error_list(code)]
    assert [(pos, error_code) for pos in positions] == errors


@pytest.mark.parametrize('code', FAILING_EXAMPLES)
def test_python_exception_matches(code):
    wanted, line_nr = _get_actual_exception(code)

    errors = _get_error_list(code)
    actual = None
    if errors:
        error, = errors
        actual = error.message
    assert actual in wanted
    # Somehow in Python3.3 the SyntaxError().lineno is sometimes None
    assert line_nr is None or line_nr == error.start_pos[0]


def test_non_async_in_async():
    """
    This example doesn't work with FAILING_EXAMPLES, because the line numbers
    are not always the same / incorrect in Python 3.8.
    """
    if sys.version_info[:2] < (3, 5):
        pytest.skip()

        # Raises multiple errors in previous versions.
    code = 'async def foo():\n def nofoo():[x async for x in []]'
    wanted, line_nr = _get_actual_exception(code)

    errors = _get_error_list(code)
    if errors:
        error, = errors
        actual = error.message
    assert actual in wanted
    if sys.version_info[:2] < (3, 8):
        assert line_nr == error.start_pos[0]
    else:
        assert line_nr == 0  # For whatever reason this is zero in Python 3.8+


@pytest.mark.parametrize(
    ('code', 'positions'), [
        ('1 +', [(1, 3)]),
        ('1 +\n', [(1, 3)]),
        ('1 +\n2 +', [(1, 3), (2, 3)]),
        ('x + 2', []),
        ('[\n', [(2, 0)]),
        ('[\ndef x(): pass', [(2, 0)]),
        ('[\nif 1: pass', [(2, 0)]),
        ('1+?', [(1, 2)]),
        ('?', [(1, 0)]),
        ('??', [(1, 0)]),
        ('? ?', [(1, 0)]),
        ('?\n?', [(1, 0), (2, 0)]),
        ('? * ?', [(1, 0)]),
        ('1 + * * 2', [(1, 4)]),
        ('?\n1\n?', [(1, 0), (3, 0)]),
    ]
)
def test_syntax_errors(code, positions):
    assert_comparison(code, 901, positions)


@pytest.mark.parametrize(
    ('code', 'positions'), [
        (' 1', [(1, 0)]),
        ('def x():\n    1\n 2', [(3, 0)]),
        ('def x():\n 1\n  2', [(3, 0)]),
        ('def x():\n1', [(2, 0)]),
    ]
)
def test_indentation_errors(code, positions):
    assert_comparison(code, 903, positions)


def _get_actual_exception(code):
    with warnings.catch_warnings():
        # We don't care about warnings where locals/globals misbehave here.
        # It's as simple as either an error or not.
        warnings.filterwarnings('ignore', category=SyntaxWarning)
        try:
            compile(code, '<unknown>', 'exec')
        except (SyntaxError, IndentationError) as e:
            wanted = e.__class__.__name__ + ': ' + e.msg
            line_nr = e.lineno
        except ValueError as e:
            # The ValueError comes from byte literals in Python 2 like '\x'
            # that are oddly enough not SyntaxErrors.
            wanted = 'SyntaxError: (value error) ' + str(e)
            line_nr = None
        else:
            assert False, "The piece of code should raise an exception."

    # SyntaxError
    # Python 2.6 has a bit different error messages here, so skip it.
    if sys.version_info[:2] == (2, 6) and wanted == 'SyntaxError: unexpected EOF while parsing':
        wanted = 'SyntaxError: invalid syntax'

    if wanted == 'SyntaxError: non-keyword arg after keyword arg':
        # The python 3.5+ way, a bit nicer.
        wanted = 'SyntaxError: positional argument follows keyword argument'
    elif wanted == 'SyntaxError: assignment to keyword':
        return [wanted, "SyntaxError: can't assign to keyword",
                'SyntaxError: cannot assign to __debug__'], line_nr
    elif wanted == 'SyntaxError: assignment to None':
        # Python 2.6 does has a slightly different error.
        wanted = 'SyntaxError: cannot assign to None'
    elif wanted == 'SyntaxError: can not assign to __debug__':
        # Python 2.6 does has a slightly different error.
        wanted = 'SyntaxError: cannot assign to __debug__'
    elif wanted == 'SyntaxError: can use starred expression only as assignment target':
        # Python 3.4/3.4 have a bit of a different warning than 3.5/3.6 in
        # certain places. But in others this error makes sense.
        return [wanted, "SyntaxError: can't use starred expression here"], line_nr
    elif wanted == 'SyntaxError: f-string: unterminated string':
        wanted = 'SyntaxError: EOL while scanning string literal'
    elif wanted == 'SyntaxError: f-string expression part cannot include a backslash':
        return [
            wanted,
            "SyntaxError: EOL while scanning string literal",
            "SyntaxError: unexpected character after line continuation character",
        ], line_nr
    elif wanted == "SyntaxError: f-string: expecting '}'":
        wanted = 'SyntaxError: EOL while scanning string literal'
    elif wanted == 'SyntaxError: f-string: empty expression not allowed':
        wanted = 'SyntaxError: invalid syntax'
    elif wanted == "SyntaxError: f-string expression part cannot include '#'":
        wanted = 'SyntaxError: invalid syntax'
    elif wanted == "SyntaxError: f-string: single '}' is not allowed":
        wanted = 'SyntaxError: invalid syntax'
    return [wanted], line_nr


def test_default_except_error_postition():
    # For this error the position seemed to be one line off, but that doesn't
    # really matter.
    code = 'try: pass\nexcept: pass\nexcept X: pass'
    wanted, line_nr = _get_actual_exception(code)
    error, = _get_error_list(code)
    assert error.message in wanted
    assert line_nr != error.start_pos[0]
    # I think this is the better position.
    assert error.start_pos[0] == 2


def test_statically_nested_blocks():
    def build(code, depth):
        if depth == 0:
            return code

        new_code = 'if 1:\n' + indent(code)
        return build(new_code, depth - 1)

    def get_error(depth, add_func=False):
        code = build('foo', depth)
        if add_func:
            code = 'def bar():\n' + indent(code)
        errors = _get_error_list(code)
        if errors:
            assert errors[0].message == 'SyntaxError: too many statically nested blocks'
            return errors[0]
        return None

    assert get_error(19) is None
    assert get_error(19, add_func=True) is None

    assert get_error(20)
    assert get_error(20, add_func=True)


def test_future_import_first():
    def is_issue(code, *args):
        code = code % args
        return bool(_get_error_list(code))

    i1 = 'from __future__ import division'
    i2 = 'from __future__ import absolute_import'
    assert not is_issue(i1)
    assert not is_issue(i1 + ';' + i2)
    assert not is_issue(i1 + '\n' + i2)
    assert not is_issue('"";' + i1)
    assert not is_issue('"";' + i1)
    assert not is_issue('""\n' + i1)
    assert not is_issue('""\n%s\n%s', i1, i2)
    assert not is_issue('""\n%s;%s', i1, i2)
    assert not is_issue('"";%s;%s ', i1, i2)
    assert not is_issue('"";%s\n%s ', i1, i2)
    assert is_issue('1;' + i1)
    assert is_issue('1\n' + i1)
    assert is_issue('"";1\n' + i1)
    assert is_issue('""\n%s\nfrom x import a\n%s', i1, i2)
    assert is_issue('%s\n""\n%s', i1, i2)


def test_named_argument_issues(works_not_in_py):
    message = works_not_in_py.get_error_message('def foo(*, **dict): pass')
    message = works_not_in_py.get_error_message('def foo(*): pass')
    if works_not_in_py.version.startswith('2'):
        assert message == 'SyntaxError: invalid syntax'
    else:
        assert message == 'SyntaxError: named arguments must follow bare *'

    works_not_in_py.assert_no_error_in_passing('def foo(*, name): pass')
    works_not_in_py.assert_no_error_in_passing('def foo(bar, *, name=1): pass')
    works_not_in_py.assert_no_error_in_passing('def foo(bar, *, name=1, **dct): pass')


def test_escape_decode_literals(each_version):
    """
    We are using internal functions to assure that unicode/bytes escaping is
    without syntax errors. Here we make a bit of quality assurance that this
    works through versions, because the internal function might change over
    time.
    """
    def get_msg(end, to=1):
        base = "SyntaxError: (unicode error) 'unicodeescape' " \
               "codec can't decode bytes in position 0-%s: " % to
        return base + end

    def get_msgs(escape):
        return (get_msg('end of string in escape sequence'),
                get_msg(r"truncated %s escape" % escape))

    error, = _get_error_list(r'u"\x"', version=each_version)
    assert error.message in get_msgs(r'\xXX')

    error, = _get_error_list(r'u"\u"', version=each_version)
    assert error.message in get_msgs(r'\uXXXX')

    error, = _get_error_list(r'u"\U"', version=each_version)
    assert error.message in get_msgs(r'\UXXXXXXXX')

    error, = _get_error_list(r'u"\N{}"', version=each_version)
    assert error.message == get_msg(r'malformed \N character escape', to=2)

    error, = _get_error_list(r'u"\N{foo}"', version=each_version)
    assert error.message == get_msg(r'unknown Unicode character name', to=6)

    # Finally bytes.
    error, = _get_error_list(r'b"\x"', version=each_version)
    wanted = r'SyntaxError: (value error) invalid \x escape'
    if sys.version_info >= (3, 0):
        # The positioning information is only available in Python 3.
        wanted += ' at position 0'
    assert error.message == wanted


def test_too_many_levels_of_indentation():
    assert not _get_error_list(build_nested('pass', 99))
    assert _get_error_list(build_nested('pass', 100))
    base = 'def x():\n if x:\n'
    assert not _get_error_list(build_nested('pass', 49, base=base))
    assert _get_error_list(build_nested('pass', 50, base=base))


@pytest.mark.parametrize(
    'code', [
        "f'{*args,}'",
        r'f"\""',
        r'f"\\\""',
        r'fr"\""',
        r'fr"\\\""',
        r"print(f'Some {x:.2f} and some {y}')",
    ]
)
def test_valid_fstrings(code):
    assert not _get_error_list(code, version='3.6')


@pytest.mark.parametrize(
    ('code', 'message'), [
        ("f'{1+}'", ('invalid syntax')),
        (r'f"\"', ('invalid syntax')),
        (r'fr"\"', ('invalid syntax')),
    ]
)
def test_invalid_fstrings(code, message):
    """
    Some fstring errors are handled differntly in 3.6 and other versions.
    Therefore check specifically for these errors here.
    """
    error, = _get_error_list(code, version='3.6')
    assert message in error.message
