import pytest

from jedi import settings
from jedi.inference.names import ValueName
from jedi.inference.compiled import CompiledValueName
from jedi.inference.gradual.typeshed import StubModuleValue


@pytest.fixture()
def auto_import_json(monkeypatch):
    monkeypatch.setattr(settings, 'auto_import_modules', ['json'])


def test_base_auto_import_modules(auto_import_json, Script):
    loads, = Script('import json; json.loads').goto_definitions()
    assert isinstance(loads._name, ValueName)
    value, = loads._name.infer()
    assert isinstance(value.parent_context._value, StubModuleValue)


def test_auto_import_modules_imports(auto_import_json, Script):
    main, = Script('from json import tool; tool.main').goto_definitions()
    assert isinstance(main._name, CompiledValueName)


def test_additional_dynamic_modules(monkeypatch, Script):
    # We could add further tests, but for now it's even more important that
    # this doesn't fail.
    monkeypatch.setattr(
        settings,
        'additional_dynamic_modules',
        ['/foo/bar/jedi_not_existing_file.py']
    )
    assert not Script('def some_func(f):\n f.').completions()
