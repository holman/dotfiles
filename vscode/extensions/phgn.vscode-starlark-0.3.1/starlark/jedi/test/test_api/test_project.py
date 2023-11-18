import os

from ..helpers import get_example_dir, set_cwd, root_dir
from jedi import Interpreter


def test_django_default_project(Script):
    dir = get_example_dir('django')

    script = Script(
        "from app import models\nmodels.SomeMo",
        path=os.path.join(dir, 'models/x.py')
    )
    c, = script.completions()
    assert c.name == "SomeModel"
    assert script._inference_state.project._django is True


def test_interpreter_project_path():
    # Run from anywhere it should be the cwd.
    dir = os.path.join(root_dir, 'test')
    with set_cwd(dir):
        project = Interpreter('', [locals()])._inference_state.project
        assert project._path == dir
