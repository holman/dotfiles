""" Test all things related to the ``jedi.api_classes`` module.
"""

from textwrap import dedent
from inspect import cleandoc

import pytest

import jedi
from jedi import __doc__ as jedi_doc
from jedi.inference.compiled import CompiledValueName


def test_is_keyword(Script):
    results = Script('str', 1, 1, None).goto_definitions()
    assert len(results) == 1 and results[0].is_keyword is False


def test_basedefinition_type(Script, names):
    def make_definitions():
        """
        Return a list of definitions for parametrized tests.

        :rtype: [jedi.api_classes.BaseDefinition]
        """
        source = dedent("""
        import sys

        class C:
            pass

        x = C()

        def f():
            pass

        def g():
            yield

        h = lambda: None
        """)

        definitions = []
        definitions += names(source)

        source += dedent("""
        variable = sys or C or x or f or g or g() or h""")
        lines = source.splitlines()
        script = Script(source, len(lines), len('variable'), None)
        definitions += script.goto_definitions()

        script2 = Script(source, 4, len('class C'), None)
        definitions += script2.usages()

        source_param = "def f(a): return a"
        script_param = Script(source_param, 1, len(source_param), None)
        definitions += script_param.goto_assignments()

        return definitions

    for definition in make_definitions():
        assert definition.type in ('module', 'class', 'instance', 'function',
                                   'generator', 'statement', 'import', 'param')


@pytest.mark.parametrize(
    ('src', 'expected_result', 'column'), [
        # import one level
        ('import t', 'module', None),
        ('import ', 'module', None),
        ('import datetime; datetime', 'module', None),

        # from
        ('from datetime import timedelta', 'class', None),
        ('from datetime import timedelta; timedelta', 'class', None),
        ('from json import tool', 'module', None),
        ('from json import tool; tool', 'module', None),

        # import two levels
        ('import json.tool; json', 'module', None),
        ('import json.tool; json.tool', 'module', None),
        ('import json.tool; json.tool.main', 'function', None),
        ('import json.tool', 'module', None),
        ('import json.tool', 'module', 9),
    ]

)
def test_basedefinition_type_import(Script, src, expected_result, column):
    types = {t.type for t in Script(src, column=column).completions()}
    assert types == {expected_result}


def test_function_call_signature_in_doc(Script):
    defs = Script("""
    def f(x, y=1, z='a'):
        pass
    f""").goto_definitions()
    doc = defs[0].docstring()
    assert "f(x, y=1, z='a')" in str(doc)


def test_param_docstring(names):
    param = names("def test(parameter): pass", all_scopes=True)[1]
    assert param.name == 'parameter'
    assert param.docstring() == ''


def test_class_call_signature(Script):
    defs = Script("""
    class Foo:
        def __init__(self, x, y=1, z='a'):
            pass
    Foo""").goto_definitions()
    doc = defs[0].docstring()
    assert doc == "Foo(x, y=1, z='a')"


def test_position_none_if_builtin(Script):
    gotos = Script('import sys; sys.path').goto_assignments()
    assert gotos[0].in_builtin_module()
    assert gotos[0].line is not None
    assert gotos[0].column is not None


def test_completion_docstring(Script, jedi_path):
    """
    Jedi should follow imports in certain conditions
    """
    def docstr(src, result):
        c = Script(src, sys_path=[jedi_path]).completions()[0]
        assert c.docstring(raw=True, fast=False) == cleandoc(result)

    c = Script('import jedi\njed', sys_path=[jedi_path]).completions()[0]
    assert c.docstring(fast=False) == cleandoc(jedi_doc)

    docstr('import jedi\njedi.Scr', cleandoc(jedi.Script.__doc__))

    docstr('abcd=3;abcd', '')
    docstr('"hello"\nabcd=3\nabcd', '')
    docstr(
        dedent('''
        def x():
            "hello"
            0
        x'''),
        'hello'
    )
    docstr(
        dedent('''
        def x():
            "hello";0
        x'''),
        'hello'
    )
    # Shouldn't work with a tuple.
    docstr(
        dedent('''
        def x():
            "hello",0
        x'''),
        ''
    )
    # Should also not work if we rename something.
    docstr(
        dedent('''
        def x():
            "hello"
        y = x
        y'''),
        ''
    )


def test_completion_params(Script):
    c = Script('import string; string.capwords').completions()[0]
    assert [p.name for p in c.params] == ['s', 'sep']


def test_functions_should_have_params(Script):
    for c in Script('bool.').completions():
        if c.type == 'function':
            assert isinstance(c.params, list)


def test_hashlib_params(Script, environment):
    if environment.version_info < (3,):
        pytest.skip()

    script = Script(source='from hashlib import sha256')
    c, = script.completions()
    assert [p.name for p in c.params] == ['arg']


def test_signature_params(Script):
    def check(defs):
        params = defs[0].params
        assert len(params) == 1
        assert params[0].name == 'bar'

    s = dedent('''
    def foo(bar):
        pass
    foo''')

    check(Script(s).goto_definitions())

    check(Script(s).goto_assignments())
    check(Script(s + '\nbar=foo\nbar').goto_assignments())


def test_param_endings(Script):
    """
    Params should be represented without the comma and whitespace they have
    around them.
    """
    sig = Script('def x(a, b=5, c=""): pass\n x(').call_signatures()[0]
    assert [p.description for p in sig.params] == ['param a', 'param b=5', 'param c=""']


@pytest.mark.parametrize(
    'code, index, name, is_definition', [
        ('name', 0, 'name', False),
        ('a = f(x)', 0, 'a', True),
        ('a = f(x)', 1, 'f', False),
        ('a = f(x)', 2, 'x', False),
    ]
)
def test_is_definition(names, code, index, name, is_definition):
    d = names(
        dedent(code),
        references=True,
        all_scopes=True,
    )[index]
    assert d.name == name
    assert d.is_definition() == is_definition


@pytest.mark.parametrize(
    'code, expected', (
        ('import x as a', [False, True]),
        ('from x import y', [False, True]),
        ('from x.z import y', [False, False, True]),
    )
)
def test_is_definition_import(names, code, expected):
    ns = names(dedent(code), references=True, all_scopes=True)
    # Assure that names are definitely sorted.
    ns = sorted(ns, key=lambda name: (name.line, name.column))
    assert [name.is_definition() for name in ns] == expected


def test_parent(Script):
    def _parent(source, line=None, column=None):
        def_, = Script(dedent(source), line, column).goto_assignments()
        return def_.parent()

    parent = _parent('foo=1\nfoo')
    assert parent.type == 'module'

    parent = _parent('''
        def spam():
            if 1:
                y=1
                y''')
    assert parent.name == 'spam'
    assert parent.parent().type == 'module'


def test_parent_on_function(Script):
    code = 'def spam():\n pass'
    def_, = Script(code, line=1, column=len('def spam')).goto_assignments()
    parent = def_.parent()
    assert parent.name == ''
    assert parent.type == 'module'


def test_parent_on_completion(Script):
    parent = Script(dedent('''\
        class Foo():
            def bar(): pass
        Foo().bar''')).completions()[0].parent()
    assert parent.name == 'Foo'
    assert parent.type == 'class'

    parent = Script('str.join').completions()[0].parent()
    assert parent.name == 'str'
    assert parent.type == 'class'


def test_parent_on_comprehension():
    ns = jedi.names('''\
    def spam():
        return [i for i in range(5)]
    ''', all_scopes=True)

    assert [name.name for name in ns] == ['spam', 'i']

    assert ns[0].parent().name == ''
    assert ns[0].parent().type == 'module'
    assert ns[1].parent().name == 'spam'
    assert ns[1].parent().type == 'function'


def test_type(Script):
    for c in Script('a = [str()]; a[0].').completions():
        if c.name == '__class__' and False:  # TODO fix.
            assert c.type == 'class'
        else:
            assert c.type in ('function', 'statement')

    for c in Script('list.').completions():
        assert c.type

    # Github issue #397, type should never raise an error.
    for c in Script('import os; os.path.').completions():
        assert c.type


def test_type_II(Script):
    """
    GitHub Issue #833, `keyword`s are seen as `module`s
    """
    for c in Script('f').completions():
        if c.name == 'for':
            assert c.type == 'keyword'


"""
This tests the BaseDefinition.goto_assignments function, not the jedi
function. They are not really different in functionality, but really
different as an implementation.
"""


def test_goto_assignment_repetition(names):
    defs = names('a = 1; a', references=True, definitions=False)
    # Repeat on the same variable. Shouldn't change once we're on a
    # definition.
    for _ in range(3):
        assert len(defs) == 1
        ass = defs[0].goto_assignments()
        assert ass[0].description == 'a = 1'


def test_goto_assignments_named_params(names):
    src = """\
            def foo(a=1, bar=2):
                pass
            foo(bar=1)
          """
    bar = names(dedent(src), references=True)[-1]
    param = bar.goto_assignments()[0]
    assert (param.line, param.column) == (1, 13)
    assert param.type == 'param'


def test_class_call(names):
    src = 'from threading import Thread; Thread(group=1)'
    n = names(src, references=True)[-1]
    assert n.name == 'group'
    param_def = n.goto_assignments()[0]
    assert param_def.name == 'group'
    assert param_def.type == 'param'


def test_parentheses(names):
    n = names('("").upper', references=True)[-1]
    assert n.goto_assignments()[0].name == 'upper'


def test_import(names):
    nms = names('from json import load', references=True)
    assert nms[0].name == 'json'
    assert nms[0].type == 'module'
    n = nms[0].goto_assignments()[0]
    assert n.name == 'json'
    assert n.type == 'module'

    assert nms[1].name == 'load'
    assert nms[1].type == 'function'
    n = nms[1].goto_assignments()[0]
    assert n.name == 'load'
    assert n.type == 'function'

    nms = names('import os; os.path', references=True)
    assert nms[0].name == 'os'
    assert nms[0].type == 'module'
    n = nms[0].goto_assignments()[0]
    assert n.name == 'os'
    assert n.type == 'module'

    n = nms[2].goto_assignments()[0]
    assert n.name == 'path'
    assert n.type == 'module'

    nms = names('import os.path', references=True)
    n = nms[0].goto_assignments()[0]
    assert n.name == 'os'
    assert n.type == 'module'
    n = nms[1].goto_assignments()[0]
    # This is very special, normally the name doesn't chance, but since
    # os.path is a sys.modules hack, it does.
    assert n.name in ('macpath', 'ntpath', 'posixpath', 'os2emxpath')
    assert n.type == 'module'


def test_import_alias(names):
    nms = names('import json as foo', references=True)
    assert nms[0].name == 'json'
    assert nms[0].type == 'module'
    assert nms[0]._name.tree_name.parent.type == 'dotted_as_name'
    n = nms[0].goto_assignments()[0]
    assert n.name == 'json'
    assert n.type == 'module'
    assert n._name._value.tree_node.type == 'file_input'

    assert nms[1].name == 'foo'
    assert nms[1].type == 'module'
    assert nms[1]._name.tree_name.parent.type == 'dotted_as_name'
    ass = nms[1].goto_assignments()
    assert len(ass) == 1
    assert ass[0].name == 'json'
    assert ass[0].type == 'module'
    assert ass[0]._name._value.tree_node.type == 'file_input'


def test_added_equals_to_params(Script):
    def run(rest_source):
        source = dedent("""
        def foo(bar, baz):
            pass
        """)
        results = Script(source + rest_source).completions()
        assert len(results) == 1
        return results[0]

    assert run('foo(bar').name_with_symbols == 'bar='
    assert run('foo(bar').complete == '='
    assert run('foo(bar, baz').complete == '='
    assert run('    bar').name_with_symbols == 'bar'
    assert run('    bar').complete == ''
    x = run('foo(bar=isins').name_with_symbols
    assert x == 'isinstance'


def test_builtin_module_with_path(Script):
    """
    This test simply tests if a module from /usr/lib/python3.8/lib-dynload/ has
    a path or not. It shouldn't have a module_path, because that is just
    confusing.
    """
    semlock, = Script('from _multiprocessing import SemLock').goto_definitions()
    assert isinstance(semlock._name, CompiledValueName)
    assert semlock.module_path is None
    assert semlock.in_builtin_module() is True
    assert semlock.name == 'SemLock'
    assert semlock.line is None
    assert semlock.column is None


@pytest.mark.parametrize(
    'code, description', [
        ('int', 'instance int'),
        ('str.index', 'instance int'),
        ('1', None),
    ]
)
def test_execute(Script, code, description):
    definition, = Script(code).goto_assignments()
    definitions = definition.execute()
    if description is None:
        assert not definitions
    else:
        d, = definitions
        assert d.description == description
