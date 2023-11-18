import os
import re
import subprocess

import pytest

from . import helpers
from . import run
from . import refactor

import jedi
from jedi.api.environment import InterpreterEnvironment


def pytest_addoption(parser):
    parser.addoption(
        "--integration-case-dir",
        default=os.path.join(helpers.test_dir, 'completion'),
        help="Directory in which integration test case files locate.")
    parser.addoption(
        "--refactor-case-dir",
        default=os.path.join(helpers.test_dir, 'refactor'),
        help="Directory in which refactoring test case files locate.")
    parser.addoption(
        "--test-files", "-T", default=[], action='append',
        help=(
            "Specify test files using FILE_NAME[:LINE[,LINE[,...]]]. "
            "For example: -T generators.py:10,13,19. "
            "Note that you can use -m to specify the test case by id."))
    parser.addoption(
        "--thirdparty", action='store_true',
        help="Include integration tests that requires third party modules.")


def parse_test_files_option(opt):
    """
    Parse option passed to --test-files into a key-value pair.

    >>> parse_test_files_option('generators.py:10,13,19')
    ('generators.py', [10, 13, 19])
    """
    opt = str(opt)
    if ':' in opt:
        (f_name, rest) = opt.split(':', 1)
        return f_name, list(map(int, rest.split(',')))
    else:
        return opt, []


def pytest_generate_tests(metafunc):
    """
    :type metafunc: _pytest.python.Metafunc
    """
    test_files = dict(map(parse_test_files_option,
                          metafunc.config.option.test_files))
    if 'case' in metafunc.fixturenames:
        base_dir = metafunc.config.option.integration_case_dir
        thirdparty = metafunc.config.option.thirdparty
        cases = list(run.collect_dir_tests(base_dir, test_files))
        if thirdparty:
            cases.extend(run.collect_dir_tests(
                os.path.join(base_dir, 'thirdparty'), test_files, True))
        ids = ["%s:%s" % (c.module_name, c.line_nr_test) for c in cases]
        metafunc.parametrize('case', cases, ids=ids)

    if 'refactor_case' in metafunc.fixturenames:
        base_dir = metafunc.config.option.refactor_case_dir
        metafunc.parametrize(
            'refactor_case',
            refactor.collect_dir_tests(base_dir, test_files))

    if 'static_analysis_case' in metafunc.fixturenames:
        base_dir = os.path.join(os.path.dirname(__file__), 'static_analysis')
        cases = list(collect_static_analysis_tests(base_dir, test_files))
        metafunc.parametrize(
            'static_analysis_case',
            cases,
            ids=[c.name for c in cases]
        )


def collect_static_analysis_tests(base_dir, test_files):
    for f_name in os.listdir(base_dir):
        files_to_execute = [a for a in test_files.items() if a[0] in f_name]
        if f_name.endswith(".py") and (not test_files or files_to_execute):
            path = os.path.join(base_dir, f_name)
            yield run.StaticAnalysisCase(path)


@pytest.fixture(scope='session')
def venv_path(tmpdir_factory, environment):
    if environment.version_info.major < 3:
        pytest.skip("python -m venv does not exist in Python 2")

    tmpdir = tmpdir_factory.mktemp('venv_path')
    dirname = os.path.join(tmpdir.dirname, 'venv')

    # We cannot use the Python from tox because tox creates virtualenvs and
    # they have different site.py files that work differently than the default
    # ones. Instead, we find the real Python executable by printing the value
    # of sys.base_prefix or sys.real_prefix if we are in a virtualenv.
    output = subprocess.check_output([
        environment.executable, "-c",
        "import sys; "
        "print(sys.real_prefix if hasattr(sys, 'real_prefix') else sys.base_prefix)"
    ])
    prefix = output.rstrip().decode('utf8')
    if os.name == 'nt':
        executable_path = os.path.join(prefix, 'python')
    else:
        executable_name = os.path.basename(environment.executable)
        executable_path = os.path.join(prefix, 'bin', executable_name)

    subprocess.call([executable_path, '-m', 'venv', dirname])
    return dirname


@pytest.fixture()
def cwd_tmpdir(monkeypatch, tmpdir):
    with helpers.set_cwd(tmpdir.strpath):
        yield tmpdir


@pytest.fixture
def inference_state(Script):
    return Script('')._inference_state


@pytest.fixture
def same_process_inference_state(Script):
    return Script('', environment=InterpreterEnvironment())._inference_state
