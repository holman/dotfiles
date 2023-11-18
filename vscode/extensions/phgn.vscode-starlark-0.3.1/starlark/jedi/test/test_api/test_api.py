"""
Test all things related to the ``jedi.api`` module.
"""

import os
import sys
from textwrap import dedent

import pytest
from pytest import raises
from parso import cache

from jedi import preload_module
from jedi.inference.gradual import typeshed


@pytest.mark.skipif(sys.version_info[0] == 2, reason="Ignore Python 2, EoL")
def test_preload_modules():
    def check_loaded(*modules):
        for grammar_cache in cache.parser_cache.values():
            if None in grammar_cache:
                break
        # Filter the typeshed parser cache.
        typeshed_cache_count = sum(
            1 for path in grammar_cache
            if path is not None and path.startswith(typeshed.TYPESHED_PATH)
        )
        # +1 for None module (currently used)
        assert len(grammar_cache) - typeshed_cache_count == len(modules) + 1
        for i in modules:
            assert [i in k for k in grammar_cache.keys() if k is not None]

    old_cache = cache.parser_cache.copy()
    cache.parser_cache.clear()

    try:
        preload_module('sys')
        check_loaded()  # compiled (c_builtin) modules shouldn't be in the cache.
        preload_module('types', 'token')
        check_loaded('types', 'token')
    finally:
        cache.parser_cache.update(old_cache)


def test_empty_script(Script):
    assert Script('')


def test_line_number_errors(Script):
    """
    Script should raise a ValueError if line/column numbers are not in a
    valid range.
    """
    s = 'hello'
    # lines
    with raises(ValueError):
        Script(s, 2, 0)
    with raises(ValueError):
        Script(s, 0, 0)

    # columns
    with raises(ValueError):
        Script(s, 1, len(s) + 1)
    with raises(ValueError):
        Script(s, 1, -1)

    # ok
    Script(s, 1, 0)
    Script(s, 1, len(s))


def _check_number(Script, source, result='float'):
    completions = Script(source).completions()
    assert completions[0].parent().name == result


def test_completion_on_number_literals(Script):
    # No completions on an int literal (is a float).
    assert [c.name for c in Script('1. ').completions()] \
        == ['and', 'if', 'in', 'is', 'not', 'or']

    # Multiple points after an int literal basically mean that there's a float
    # and a call after that.
    _check_number(Script, '1..')
    _check_number(Script, '1.0.')

    # power notation
    _check_number(Script, '1.e14.')
    _check_number(Script, '1.e-3.')
    _check_number(Script, '9e3.')
    assert Script('1.e3..').completions() == []
    assert Script('1.e-13..').completions() == []


def test_completion_on_hex_literals(Script):
    assert Script('0x1..').completions() == []
    _check_number(Script, '0x1.', 'int')  # hexdecimal
    # Completing binary literals doesn't work if they are not actually binary
    # (invalid statements).
    assert Script('0b2.b').completions() == []
    _check_number(Script, '0b1.', 'int')  # binary

    _check_number(Script, '0x2e.', 'int')
    _check_number(Script, '0xE7.', 'int')
    _check_number(Script, '0xEa.', 'int')
    # theoretically, but people can just check for syntax errors:
    assert Script('0x.').completions() == []


def test_completion_on_complex_literals(Script):
    assert Script('1j..').completions() == []
    _check_number(Script, '1j.', 'complex')
    _check_number(Script, '44.j.', 'complex')
    _check_number(Script, '4.0j.', 'complex')
    # No dot no completion - I thought, but 4j is actually a literal after
    # which a keyword like or is allowed. Good times, haha!
    # However this has been disabled again, because it apparently annoyed
    # users. So no completion after j without a space :)
    assert not Script('4j').completions()
    assert ({c.name for c in Script('4j ').completions()} ==
            {'if', 'and', 'in', 'is', 'not', 'or'})


def test_goto_assignments_on_non_name(Script, environment):
    assert Script('for').goto_assignments() == []

    assert Script('assert').goto_assignments() == []
    assert Script('True').goto_assignments() == []


def test_goto_definitions_on_non_name(Script):
    assert Script('import x', column=0).goto_definitions() == []


def test_goto_definitions_on_generator(Script):
    def_, = Script('def x(): yield 1\ny=x()\ny').goto_definitions()
    assert def_.name == 'Generator'


def test_goto_definition_not_multiple(Script):
    """
    There should be only one Definition result if it leads back to the same
    origin (e.g. instance method)
    """

    s = dedent('''\
            import random
            class A():
                def __init__(self, a):
                    self.a = 3

                def foo(self):
                    pass

            if random.randint(0, 1):
                a = A(2)
            else:
                a = A(1)
            a''')
    assert len(Script(s).goto_definitions()) == 1


def test_usage_description(Script):
    descs = [u.description for u in Script("foo = ''; foo").usages()]
    assert set(descs) == {"foo = ''", 'foo'}


def test_get_line_code(Script):
    def get_line_code(source, line=None, **kwargs):
        return Script(source, line=line).completions()[0].get_line_code(**kwargs)

    # On builtin
    assert get_line_code('') == ''

    # On custom code
    first_line = 'def foo():\n'
    line = '    foo'
    code = first_line + line
    assert get_line_code(code) == first_line

    # With before/after
    code = code + '\nother_line'
    assert get_line_code(code, line=2) == first_line
    assert get_line_code(code, line=2, after=1) == first_line + line + '\n'
    assert get_line_code(code, line=2, after=2, before=1) == code
    # Should just be the whole thing, since there are no more lines on both
    # sides.
    assert get_line_code(code, line=2, after=3, before=3) == code


def test_goto_assignments_follow_imports(Script):
    code = dedent("""
    import inspect
    inspect.isfunction""")
    definition, = Script(code, column=0).goto_assignments(follow_imports=True)
    assert 'inspect.py' in definition.module_path
    assert (definition.line, definition.column) == (1, 0)

    definition, = Script(code).goto_assignments(follow_imports=True)
    assert 'inspect.py' in definition.module_path
    assert (definition.line, definition.column) > (1, 0)

    code = '''def param(p): pass\nparam(1)'''
    start_pos = 1, len('def param(')

    script = Script(code, *start_pos)
    definition, = script.goto_assignments(follow_imports=True)
    assert (definition.line, definition.column) == start_pos
    assert definition.name == 'p'
    result, = definition.goto_assignments()
    assert result.name == 'p'
    result, = definition.infer()
    assert result.name == 'int'
    result, = result.infer()
    assert result.name == 'int'

    definition, = script.goto_assignments()
    assert (definition.line, definition.column) == start_pos

    d, = Script('a = 1\na').goto_assignments(follow_imports=True)
    assert d.name == 'a'


def test_goto_module(Script):
    def check(line, expected, follow_imports=False):
        script = Script(path=path, line=line)
        module, = script.goto_assignments(follow_imports=follow_imports)
        assert module.module_path == expected

    base_path = os.path.join(os.path.dirname(__file__), 'simple_import')
    path = os.path.join(base_path, '__init__.py')

    check(1, os.path.join(base_path, 'module.py'))
    check(1, os.path.join(base_path, 'module.py'), follow_imports=True)
    check(5, os.path.join(base_path, 'module2.py'))


def test_goto_definition_cursor(Script):

    s = ("class A():\n"
         "    def _something(self):\n"
         "        return\n"
         "    def different_line(self,\n"
         "                   b):\n"
         "        return\n"
         "A._something\n"
         "A.different_line"
         )

    in_name = 2, 9
    under_score = 2, 8
    cls = 2, 7
    should1 = 7, 10
    diff_line = 4, 10
    should2 = 8, 10

    def get_def(pos):
        return [d.description for d in Script(s, *pos).goto_definitions()]

    in_name = get_def(in_name)
    under_score = get_def(under_score)
    should1 = get_def(should1)
    should2 = get_def(should2)

    diff_line = get_def(diff_line)

    assert should1 == in_name
    assert should1 == under_score

    assert should2 == diff_line

    assert get_def(cls) == []


def test_no_statement_parent(Script):
    source = dedent("""
    def f():
        pass

    class C:
        pass

    variable = f if random.choice([0, 1]) else C""")
    defs = Script(source, column=3).goto_definitions()
    defs = sorted(defs, key=lambda d: d.line)
    assert [d.description for d in defs] == ['def f', 'class C']


def test_backslash_continuation_and_bracket(Script):
    code = dedent(r"""
    x = 0
    a = \
      [1, 2, 3, (x)]""")

    lines = code.splitlines()
    column = lines[-1].index('(')
    def_, = Script(code, line=len(lines), column=column).goto_definitions()
    assert def_.name == 'int'


def test_goto_follow_builtin_imports(Script):
    s = Script('import sys; sys')
    d, = s.goto_assignments(follow_imports=True)
    assert d.in_builtin_module() is True
    d, = s.goto_assignments(follow_imports=True, follow_builtin_imports=True)
    assert d.in_builtin_module() is True
