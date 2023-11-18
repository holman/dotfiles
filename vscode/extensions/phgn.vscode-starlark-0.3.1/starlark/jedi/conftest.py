import tempfile
import shutil
import os
from functools import partial

import pytest

import jedi
from jedi.api.environment import get_system_environment, InterpreterEnvironment
from jedi._compatibility import py_version

collect_ignore = [
    'setup.py',
    '__main__.py',
    'jedi/inference/compiled/subprocess/__main__.py',
    'build/',
    'test/examples',
]


# The following hooks (pytest_configure, pytest_unconfigure) are used
# to modify `jedi.settings.cache_directory` because `clean_jedi_cache`
# has no effect during doctests.  Without these hooks, doctests uses
# user's cache (e.g., ~/.cache/jedi/).  We should remove this
# workaround once the problem is fixed in pytest.
#
# See:
# - https://github.com/davidhalter/jedi/pull/168
# - https://bitbucket.org/hpk42/pytest/issue/275/

jedi_cache_directory_orig = None
jedi_cache_directory_temp = None


def pytest_addoption(parser):
    parser.addoption("--jedi-debug", "-D", action='store_true',
                     help="Enables Jedi's debug output.")

    parser.addoption("--warning-is-error", action='store_true',
                     help="Warnings are treated as errors.")

    parser.addoption("--env", action='store',
                     help="Execute the tests in that environment (e.g. 35 for python3.5).")
    parser.addoption("--interpreter-env", "-I", action='store_true',
                     help="Don't use subprocesses to guarantee having safe "
                          "code execution. Useful for debugging.")


def pytest_configure(config):
    global jedi_cache_directory_orig, jedi_cache_directory_temp
    jedi_cache_directory_orig = jedi.settings.cache_directory
    jedi_cache_directory_temp = tempfile.mkdtemp(prefix='jedi-test-')
    jedi.settings.cache_directory = jedi_cache_directory_temp

    if config.option.jedi_debug:
        jedi.set_debug_function()

    if config.option.warning_is_error:
        import warnings
        warnings.simplefilter("error")


def pytest_unconfigure(config):
    global jedi_cache_directory_orig, jedi_cache_directory_temp
    jedi.settings.cache_directory = jedi_cache_directory_orig
    shutil.rmtree(jedi_cache_directory_temp)


@pytest.fixture(scope='session')
def clean_jedi_cache(request):
    """
    Set `jedi.settings.cache_directory` to a temporary directory during test.

    Note that you can't use built-in `tmpdir` and `monkeypatch`
    fixture here because their scope is 'function', which is not used
    in 'session' scope fixture.

    This fixture is activated in ../pytest.ini.
    """
    from jedi import settings
    old = settings.cache_directory
    tmp = tempfile.mkdtemp(prefix='jedi-test-')
    settings.cache_directory = tmp

    @request.addfinalizer
    def restore():
        settings.cache_directory = old
        shutil.rmtree(tmp)


@pytest.fixture(scope='session')
def environment(request):
    if request.config.option.interpreter_env:
        return InterpreterEnvironment()

    version = request.config.option.env
    if version is None:
        version = os.environ.get('JEDI_TEST_ENVIRONMENT', str(py_version))

    return get_system_environment(version[0] + '.' + version[1:])


@pytest.fixture(scope='session')
def Script(environment):
    return partial(jedi.Script, environment=environment)


@pytest.fixture(scope='session')
def names(environment):
    return partial(jedi.names, environment=environment)


@pytest.fixture(scope='session')
def has_typing(environment):
    if environment.version_info >= (3, 5, 0):
        # This if is just needed to avoid that tests ever skip way more than
        # they should for all Python versions.
        return True

    script = jedi.Script('import typing', environment=environment)
    return bool(script.goto_definitions())


@pytest.fixture(scope='session')
def jedi_path():
    return os.path.dirname(__file__)


@pytest.fixture()
def skip_python2(environment):
    if environment.version_info.major == 2:
        # This if is just needed to avoid that tests ever skip way more than
        # they should for all Python versions.
        pytest.skip()


@pytest.fixture()
def skip_pre_python38(environment):
    if environment.version_info < (3, 8):
        # This if is just needed to avoid that tests ever skip way more than
        # they should for all Python versions.
        pytest.skip()


@pytest.fixture()
def skip_pre_python37(environment):
    if environment.version_info < (3, 7):
        # This if is just needed to avoid that tests ever skip way more than
        # they should for all Python versions.
        pytest.skip()


@pytest.fixture()
def skip_pre_python35(environment):
    if environment.version_info < (3, 5):
        # This if is just needed to avoid that tests ever skip way more than
        # they should for all Python versions.
        pytest.skip()
