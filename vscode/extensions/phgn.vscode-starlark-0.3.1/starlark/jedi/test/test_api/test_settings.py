import os

import pytest

from jedi import api
from jedi.inference import imports
from ..helpers import cwd_at


@pytest.mark.skipif('True', reason='Skip for now, test case is not really supported.')
@cwd_at('jedi')
def test_add_dynamic_mods(Script):
    fname = '__main__.py'
    api.settings.additional_dynamic_modules = [fname]
    # Fictional module that defines a function.
    src1 = "def r(a): return a"
    # Other fictional modules in another place in the fs.
    src2 = 'from .. import setup; setup.r(1)'
    script = Script(src1, path='../setup.py')
    imports.load_module(script._inference_state, os.path.abspath(fname), src2)
    result = script.goto_definitions()
    assert len(result) == 1
    assert result[0].description == 'class int'


def test_add_bracket_after_function(monkeypatch, Script):
    settings = api.settings
    monkeypatch.setattr(settings, 'add_bracket_after_function', True)
    script = Script('''\
def foo():
    pass
foo''')
    completions = script.completions()
    assert completions[0].complete == '('
