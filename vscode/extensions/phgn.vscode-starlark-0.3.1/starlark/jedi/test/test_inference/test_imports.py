"""
Tests of various import related things that could not be tested with "Black Box
Tests".
"""

import os

import pytest
from jedi.file_io import FileIO, KnownContentFileIO

from jedi._compatibility import find_module_py33, find_module
from jedi.inference import compiled
from jedi.inference import imports
from jedi.api.project import Project
from jedi.inference.gradual.conversion import _stub_to_python_value_set
from ..helpers import cwd_at, get_example_dir, test_dir, root_dir

THIS_DIR = os.path.dirname(__file__)


@pytest.mark.skipif('sys.version_info < (3,3)')
def test_find_module_py33():
    """Needs to work like the old find_module."""
    assert find_module_py33('_io') == (None, False)
    with pytest.raises(ImportError):
        assert find_module_py33('_DOESNTEXIST_') == (None, None)


def test_find_module_package():
    file_io, is_package = find_module('json')
    assert file_io.path.endswith(os.path.join('json', '__init__.py'))
    assert is_package is True


def test_find_module_not_package():
    file_io, is_package = find_module('io')
    assert file_io.path.endswith('io.py')
    assert is_package is False


pkg_zip_path = os.path.join(os.path.dirname(__file__),
                            'zipped_imports',
                            'pkg.zip')


def test_find_module_package_zipped(Script, inference_state, environment):
    sys_path = environment.get_sys_path() + [pkg_zip_path]
    script = Script('import pkg; pkg.mod', sys_path=sys_path)
    assert len(script.completions()) == 1

    file_io, is_package = inference_state.compiled_subprocess.get_module_info(
        sys_path=sys_path,
        string=u'pkg',
        full_name=u'pkg'
    )
    assert file_io is not None
    assert file_io.path.endswith(os.path.join('pkg.zip', 'pkg', '__init__.py'))
    assert file_io._zip_path.endswith('pkg.zip')
    assert is_package is True


@pytest.mark.parametrize(
    'code, file, package, path', [
        ('import pkg', '__init__.py', 'pkg', 'pkg'),
        ('import pkg', '__init__.py', 'pkg', 'pkg'),

        ('from pkg import module', 'module.py', 'pkg', None),
        ('from pkg.module', 'module.py', 'pkg', None),

        ('from pkg import nested', os.path.join('nested', '__init__.py'),
         'pkg.nested', os.path.join('pkg', 'nested')),
        ('from pkg.nested', os.path.join('nested', '__init__.py'),
         'pkg.nested', os.path.join('pkg', 'nested')),

        ('from pkg.nested import nested_module',
         os.path.join('nested', 'nested_module.py'), 'pkg.nested', None),
        ('from pkg.nested.nested_module',
         os.path.join('nested', 'nested_module.py'), 'pkg.nested', None),

        ('from pkg.namespace import namespace_module',
         os.path.join('namespace', 'namespace_module.py'), 'pkg.namespace', None),
        ('from pkg.namespace.namespace_module',
         os.path.join('namespace', 'namespace_module.py'), 'pkg.namespace', None),
    ]

)
def test_correct_zip_package_behavior(Script, inference_state, environment, code,
                                      file, package, path, skip_python2):
    sys_path = environment.get_sys_path() + [pkg_zip_path]
    pkg, = Script(code, sys_path=sys_path).goto_definitions()
    value, = pkg._name.infer()
    assert value.py__file__() == os.path.join(pkg_zip_path, 'pkg', file)
    assert '.'.join(value.py__package__()) == package
    assert value.is_package is (path is not None)
    if path is not None:
        assert value.py__path__() == [os.path.join(pkg_zip_path, path)]


def test_find_module_not_package_zipped(Script, inference_state, environment):
    path = os.path.join(os.path.dirname(__file__), 'zipped_imports/not_pkg.zip')
    sys_path = environment.get_sys_path() + [path]
    script = Script('import not_pkg; not_pkg.val', sys_path=sys_path)
    assert len(script.completions()) == 1

    file_io, is_package = inference_state.compiled_subprocess.get_module_info(
        sys_path=sys_path,
        string=u'not_pkg',
        full_name=u'not_pkg'
    )
    assert file_io.path.endswith(os.path.join('not_pkg.zip', 'not_pkg.py'))
    assert is_package is False


@cwd_at('test/test_inference/not_in_sys_path/pkg')
def test_import_not_in_sys_path(Script):
    """
    non-direct imports (not in sys.path)
    """
    a = Script(path='module.py', line=5).goto_definitions()
    assert a[0].name == 'int'

    a = Script(path='module.py', line=6).goto_definitions()
    assert a[0].name == 'str'
    a = Script(path='module.py', line=7).goto_definitions()
    assert a[0].name == 'str'


@pytest.mark.parametrize("code,name", [
    ("from flask.ext import foo; foo.", "Foo"),  # flask_foo.py
    ("from flask.ext import bar; bar.", "Bar"),  # flaskext/bar.py
    ("from flask.ext import baz; baz.", "Baz"),  # flask_baz/__init__.py
    ("from flask.ext import moo; moo.", "Moo"),  # flaskext/moo/__init__.py
    ("from flask.ext.", "foo"),
    ("from flask.ext.", "bar"),
    ("from flask.ext.", "baz"),
    ("from flask.ext.", "moo"),
    pytest.param("import flask.ext.foo; flask.ext.foo.", "Foo", marks=pytest.mark.xfail),
    pytest.param("import flask.ext.bar; flask.ext.bar.", "Foo", marks=pytest.mark.xfail),
    pytest.param("import flask.ext.baz; flask.ext.baz.", "Foo", marks=pytest.mark.xfail),
    pytest.param("import flask.ext.moo; flask.ext.moo.", "Foo", marks=pytest.mark.xfail),
])
def test_flask_ext(Script, code, name):
    """flask.ext.foo is really imported from flaskext.foo or flask_foo.
    """
    path = os.path.join(os.path.dirname(__file__), 'flask-site-packages')
    completions = Script(code, sys_path=[path]).completions()
    assert name in [c.name for c in completions]


@cwd_at('test/test_inference/')
def test_not_importable_file(Script):
    src = 'import not_importable_file as x; x.'
    assert not Script(src, path='example.py').completions()


def test_import_unique(Script):
    src = "import os; os.path"
    defs = Script(src, path='example.py').goto_definitions()
    parent_contexts = [d._name._value for d in defs]
    assert len(parent_contexts) == len(set(parent_contexts))


def test_cache_works_with_sys_path_param(Script, tmpdir):
    foo_path = tmpdir.join('foo')
    bar_path = tmpdir.join('bar')
    foo_path.join('module.py').write('foo = 123', ensure=True)
    bar_path.join('module.py').write('bar = 123', ensure=True)
    foo_completions = Script('import module; module.',
                             sys_path=[foo_path.strpath]).completions()
    bar_completions = Script('import module; module.',
                             sys_path=[bar_path.strpath]).completions()
    assert 'foo' in [c.name for c in foo_completions]
    assert 'bar' not in [c.name for c in foo_completions]

    assert 'bar' in [c.name for c in bar_completions]
    assert 'foo' not in [c.name for c in bar_completions]


def test_import_completion_docstring(Script):
    import abc
    s = Script('"""test"""\nimport ab')
    abc_completions = [c for c in s.completions() if c.name == 'abc']
    assert len(abc_completions) == 1
    assert abc_completions[0].docstring(fast=False) == abc.__doc__

    # However for performance reasons not all modules are loaded and the
    # docstring is empty in this case.
    assert abc_completions[0].docstring() == ''


def test_goto_definition_on_import(Script):
    assert Script("import sys_blabla", 1, 8).goto_definitions() == []
    assert len(Script("import sys", 1, 8).goto_definitions()) == 1


@cwd_at('jedi')
def test_complete_on_empty_import(Script):
    assert Script("from datetime import").completions()[0].name == 'import'
    # should just list the files in the directory
    assert 10 < len(Script("from .", path='whatever.py').completions()) < 30

    # Global import
    assert len(Script("from . import", 1, 5, 'whatever.py').completions()) > 30
    # relative import
    assert 10 < len(Script("from . import", 1, 6, 'whatever.py').completions()) < 30

    # Global import
    assert len(Script("from . import classes", 1, 5, 'whatever.py').completions()) > 30
    # relative import
    assert 10 < len(Script("from . import classes", 1, 6, 'whatever.py').completions()) < 30

    wanted = {'ImportError', 'import', 'ImportWarning'}
    assert {c.name for c in Script("import").completions()} == wanted
    assert len(Script("import import", path='').completions()) > 0

    # 111
    assert Script("from datetime import").completions()[0].name == 'import'
    assert Script("from datetime import ").completions()


def test_imports_on_global_namespace_without_path(Script):
    """If the path is None, there shouldn't be any import problem"""
    completions = Script("import operator").completions()
    assert [c.name for c in completions] == ['operator']
    completions = Script("import operator", path='example.py').completions()
    assert [c.name for c in completions] == ['operator']

    # the first one has a path the second doesn't
    completions = Script("import keyword", path='example.py').completions()
    assert [c.name for c in completions] == ['keyword']
    completions = Script("import keyword").completions()
    assert [c.name for c in completions] == ['keyword']


def test_named_import(Script):
    """named import - jedi-vim issue #8"""
    s = "import time as dt"
    assert len(Script(s, 1, 15, '/').goto_definitions()) == 1
    assert len(Script(s, 1, 10, '/').goto_definitions()) == 1


@pytest.mark.skipif('True', reason='The nested import stuff is still very messy.')
def test_goto_following_on_imports(Script):
    s = "import multiprocessing.dummy; multiprocessing.dummy"
    g = Script(s).goto_assignments()
    assert len(g) == 1
    assert (g[0].line, g[0].column) != (0, 0)


def test_goto_assignments(Script):
    sys, = Script("import sys", 1, 10).goto_assignments(follow_imports=True)
    assert sys.type == 'module'


def test_os_after_from(Script):
    def check(source, result, column=None):
        completions = Script(source, column=column).completions()
        assert [c.name for c in completions] == result

    check('\nfrom os. ', ['path'])
    check('\nfrom os ', ['import'])
    check('from os ', ['import'])
    check('\nfrom os import whatever', ['import'], len('from os im'))

    check('from os\\\n', ['import'])
    check('from os \\\n', ['import'])


def test_os_issues(Script):
    def import_names(*args, **kwargs):
        return [d.name for d in Script(*args, **kwargs).completions()]

    # Github issue #759
    s = 'import os, s'
    assert 'sys' in import_names(s)
    assert 'path' not in import_names(s, column=len(s) - 1)
    assert 'os' in import_names(s, column=len(s) - 3)

    # Some more checks
    s = 'from os import path, e'
    assert 'environ' in import_names(s)
    assert 'json' not in import_names(s, column=len(s) - 1)
    assert 'environ' in import_names(s, column=len(s) - 1)
    assert 'path' in import_names(s, column=len(s) - 3)


def test_path_issues(Script):
    """
    See pull request #684 for details.
    """
    source = '''from datetime import '''
    assert Script(source).completions()


def test_compiled_import_none(monkeypatch, Script):
    """
    Related to #1079. An import might somehow fail and return None.
    """
    script = Script('import sys')
    monkeypatch.setattr(compiled, 'load_module', lambda *args, **kwargs: None)
    def_, = script.goto_definitions()
    assert def_.type == 'module'
    value, = def_._name.infer()
    assert not _stub_to_python_value_set(value)


@pytest.mark.parametrize(
    ('path', 'is_package', 'goal'), [
        (os.path.join(THIS_DIR, 'test_docstring.py'), False, ('ok', 'lala', 'test_imports')),
        (os.path.join(THIS_DIR, '__init__.py'), True, ('ok', 'lala', 'x', 'test_imports')),
    ]
)
def test_get_modules_containing_name(inference_state, path, goal, is_package):
    module = imports._load_python_module(
        inference_state,
        FileIO(path),
        import_names=('ok', 'lala', 'x'),
        is_package=is_package,
    )
    assert module
    module_context = module.as_context()
    input_module, found_module = imports.get_module_contexts_containing_name(
        inference_state,
        [module_context],
        'string_that_only_exists_here'
    )
    assert input_module is module_context
    assert found_module.string_names == goal


@pytest.mark.parametrize(
    ('path', 'base_names', 'is_package', 'names'), [
        ('/foo/bar.py', ('foo',), False, ('foo', 'bar')),
        ('/foo/bar.py', ('foo', 'baz'), False, ('foo', 'baz', 'bar')),
        ('/foo/__init__.py', ('foo',), True, ('foo',)),
        ('/__init__.py', ('foo',), True, ('foo',)),
        ('/foo/bar/__init__.py', ('foo',), True, ('foo',)),
        ('/foo/bar/__init__.py', ('foo', 'bar'), True, ('foo', 'bar')),
    ]
)
def test_load_module_from_path(inference_state, path, base_names, is_package, names):
    file_io = KnownContentFileIO(path, '')
    m = imports._load_module_from_path(inference_state, file_io, base_names)
    assert m.is_package == is_package
    assert m.string_names == names


@pytest.mark.parametrize(
    'path', ('api/whatever/test_this.py', 'api/whatever/file'))
@pytest.mark.parametrize('empty_sys_path', (False, True))
def test_relative_imports_with_multiple_similar_directories(Script, path, empty_sys_path):
    dir = get_example_dir('issue1209')
    if empty_sys_path:
        project = Project(dir, sys_path=(), smart_sys_path=False)
    else:
        project = Project(dir)
    script = Script(
        "from . ",
        path=os.path.join(dir, path),
        _project=project,
    )
    name, import_ = script.completions()
    assert import_.name == 'import'
    assert name.name == 'api_test1'


def test_relative_imports_with_outside_paths(Script):
    dir = get_example_dir('issue1209')
    project = Project(dir, sys_path=[], smart_sys_path=False)
    script = Script(
        "from ...",
        path=os.path.join(dir, 'api/whatever/test_this.py'),
        _project=project,
    )
    assert [c.name for c in script.completions()] == ['api', 'import', 'whatever']

    script = Script(
        "from " + '.' * 100,
        path=os.path.join(dir, 'api/whatever/test_this.py'),
        _project=project,
    )
    assert [c.name for c in script.completions()] == ['import']


@cwd_at('test/examples/issue1209/api/whatever/')
def test_relative_imports_without_path(Script):
    project = Project('.', sys_path=[], smart_sys_path=False)
    script = Script("from . ", _project=project)
    assert [c.name for c in script.completions()] == ['api_test1', 'import']

    script = Script("from .. ", _project=project)
    assert [c.name for c in script.completions()] == ['import', 'whatever']

    script = Script("from ... ", _project=project)
    assert [c.name for c in script.completions()] == ['api', 'import', 'whatever']


def test_relative_import_out_of_file_system(Script):
    script = Script("from " + '.' * 100)
    import_, = script.completions()
    assert import_.name == 'import'

    script = Script("from " + '.' * 100 + 'abc import ABCMeta')
    assert not script.goto_definitions()
    assert not script.completions()


@pytest.mark.parametrize(
    'level, directory, project_path, result', [
        (1, '/a/b/c', '/a', (['b', 'c'], '/a')),
        (2, '/a/b/c', '/a', (['b'], '/a')),
        (3, '/a/b/c', '/a', ([], '/a')),
        (4, '/a/b/c', '/a', (None, '/')),
        (5, '/a/b/c', '/a', (None, None)),
        (1, '/', '/', ([], '/')),
        (2, '/', '/', (None, None)),
        (1, '/a/b', '/a/b/c', (None, '/a/b')),
        (2, '/a/b', '/a/b/c', (None, '/a')),
        (3, '/a/b', '/a/b/c', (None, '/')),
    ]
)
def test_level_to_import_path(level, directory, project_path, result):
    assert imports._level_to_base_import_path(project_path, directory, level) == result


def test_import_name_calculation(Script):
    s = Script(path=os.path.join(test_dir, 'completion', 'isinstance.py'))
    m = s._get_module_context()
    assert m.string_names == ('test', 'completion', 'isinstance')


@pytest.mark.parametrize('name', ('builtins', 'typing'))
def test_pre_defined_imports_module(Script, environment, name):
    if environment.version_info.major < 3 and name == 'builtins':
        name = '__builtin__'

    path = os.path.join(root_dir, name + '.py')
    module = Script('', path=path)._get_module_context()
    assert module.string_names == (name,)

    assert module.inference_state.builtins_module.py__file__() != path
    assert module.inference_state.typing_module.py__file__() != path


@pytest.mark.parametrize('name', ('builtins', 'typing'))
def test_import_needed_modules_by_jedi(Script, environment, tmpdir, name):
    if environment.version_info.major < 3 and name == 'builtins':
        name = '__builtin__'

    module_path = tmpdir.join(name + '.py')
    module_path.write('int = ...')
    script = Script(
        'import ' + name,
        path=tmpdir.join('something.py').strpath,
        sys_path=[tmpdir.strpath] + environment.get_sys_path(),
    )
    module, = script.goto_definitions()
    assert module._inference_state.builtins_module.py__file__() != module_path
    assert module._inference_state.typing_module.py__file__() != module_path


def test_import_with_semicolon(Script):
    names = [c.name for c in Script('xzy; from abc import ').completions()]
    assert 'ABCMeta' in names
    assert 'abc' not in names


def test_relative_import_star(Script):
    # Coming from github #1235
    import jedi

    source = """
    from . import *
    furl.c
    """
    script = jedi.Script(source, 3, len("furl.c"), 'export.py')

    assert script.completions()
