from os.path import dirname, join

import pytest


@pytest.fixture(autouse=True)
def skip_not_supported_versions(environment):
    if environment.version_info < (3, 4):
        pytest.skip()


def test_implicit_namespace_package(Script):
    sys_path = [join(dirname(__file__), d)
                for d in ['implicit_namespace_package/ns1', 'implicit_namespace_package/ns2']]

    def script_with_path(*args, **kwargs):
        return Script(sys_path=sys_path, *args, **kwargs)

    # goto definition
    assert script_with_path('from pkg import ns1_file').goto_definitions()
    assert script_with_path('from pkg import ns2_file').goto_definitions()
    assert not script_with_path('from pkg import ns3_file').goto_definitions()

    # goto assignment
    tests = {
        'from pkg.ns2_file import foo': 'ns2_file!',
        'from pkg.ns1_file import foo': 'ns1_file!',
    }
    for source, solution in tests.items():
        ass = script_with_path(source).goto_assignments()
        assert len(ass) == 1
        assert ass[0].description == "foo = '%s'" % solution

    # completion
    completions = script_with_path('from pkg import ').completions()
    names = [c.name for c in completions]
    compare = ['ns1_file', 'ns2_file']
    # must at least contain these items, other items are not important
    assert set(compare) == set(names)

    tests = {
        'from pkg import ns2_file as x': 'ns2_file!',
        'from pkg import ns1_file as x': 'ns1_file!'
    }
    for source, solution in tests.items():
        for c in script_with_path(source + '; x.').completions():
            if c.name == 'foo':
                completion = c
        solution = "foo = '%s'" % solution
        assert completion.description == solution


def test_implicit_nested_namespace_package(Script):
    code = 'from implicit_nested_namespaces.namespace.pkg.module import CONST'

    sys_path = [dirname(__file__)]

    script = Script(sys_path=sys_path, source=code, line=1, column=61)

    result = script.goto_definitions()

    assert len(result) == 1

    implicit_pkg, = Script(code, column=10, sys_path=sys_path).goto_definitions()
    assert implicit_pkg.type == 'module'
    assert implicit_pkg.module_path is None


def test_implicit_namespace_package_import_autocomplete(Script):
    CODE = 'from implicit_name'

    sys_path = [dirname(__file__)]

    script = Script(sys_path=sys_path, source=CODE)
    compl = script.completions()
    assert [c.name for c in compl] == ['implicit_namespace_package']


def test_namespace_package_in_multiple_directories_autocompletion(Script):
    CODE = 'from pkg.'
    sys_path = [join(dirname(__file__), d)
                for d in ['implicit_namespace_package/ns1', 'implicit_namespace_package/ns2']]

    script = Script(sys_path=sys_path, source=CODE)
    compl = script.completions()
    assert set(c.name for c in compl) == set(['ns1_file', 'ns2_file'])


def test_namespace_package_in_multiple_directories_goto_definition(Script):
    CODE = 'from pkg import ns1_file'
    sys_path = [join(dirname(__file__), d)
                for d in ['implicit_namespace_package/ns1', 'implicit_namespace_package/ns2']]
    script = Script(sys_path=sys_path, source=CODE)
    result = script.goto_definitions()
    assert len(result) == 1


def test_namespace_name_autocompletion_full_name(Script):
    CODE = 'from pk'
    sys_path = [join(dirname(__file__), d)
                for d in ['implicit_namespace_package/ns1', 'implicit_namespace_package/ns2']]

    script = Script(sys_path=sys_path, source=CODE)
    compl = script.completions()
    assert set(c.full_name for c in compl) == set(['pkg'])
