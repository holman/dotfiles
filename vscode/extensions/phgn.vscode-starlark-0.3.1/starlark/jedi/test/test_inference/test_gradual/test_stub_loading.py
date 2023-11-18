from functools import partial
from test.helpers import get_example_dir
from jedi.api.project import Project

import pytest


@pytest.fixture
def ScriptInStubFolder(Script):
    path = get_example_dir('stub_packages')
    project = Project(path, sys_path=[path], smart_sys_path=False)
    return partial(Script, _project=project)


@pytest.mark.parametrize(
    ('code', 'expected'), [
        ('from no_python import foo', ['int']),
        ('from with_python import stub_only', ['str']),
        ('from with_python import python_only', ['int']),
        ('from with_python import both', ['int']),
        ('from with_python import something_random', []),
        ('from with_python.module import in_sub_module', ['int']),
    ]
)
def test_find_stubs_infer(ScriptInStubFolder, code, expected):
    defs = ScriptInStubFolder(code).goto_definitions()
    assert [d.name for d in defs] == expected
