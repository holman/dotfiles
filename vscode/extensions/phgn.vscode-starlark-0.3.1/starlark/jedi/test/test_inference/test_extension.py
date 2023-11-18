"""
Test compiled module
"""
import os

import jedi
from ..helpers import cwd_at
import pytest


def test_completions(Script):
    s = Script('import _ctypes; _ctypes.')
    assert len(s.completions()) >= 15


def test_call_signatures_extension(Script):
    if os.name == 'nt':
        func = 'LoadLibrary'
        params = 1
    else:
        func = 'dlopen'
        params = 2
    s = Script('import _ctypes; _ctypes.%s(' % (func,))
    sigs = s.call_signatures()
    assert len(sigs) == 1
    assert len(sigs[0].params) == params


def test_call_signatures_stdlib(Script):
    s = Script('import math; math.cos(')
    sigs = s.call_signatures()
    assert len(sigs) == 1
    assert len(sigs[0].params) == 1


# Check only on linux 64 bit platform and Python3.4.
@pytest.mark.skipif('sys.platform != "linux" or sys.maxsize <= 2**32 or sys.version_info[:2] != (3, 4)')
@cwd_at('test/test_inference')
def test_init_extension_module(Script):
    """
    ``__init__`` extension modules are also packages and Jedi should understand
    that.

    Originally coming from #472.

    This test was built by the module.c and setup.py combination you can find
    in the init_extension_module folder. You can easily build the
    `__init__.cpython-34m.so` by compiling it (create a virtualenv and run
    `setup.py install`.

    This is also why this test only runs on certain systems (and Python 3.4).
    """
    s = jedi.Script('import init_extension_module as i\ni.', path='not_existing.py')
    assert 'foo' in [c.name for c in s.completions()]

    s = jedi.Script('from init_extension_module import foo\nfoo', path='not_existing.py')
    assert ['foo'] == [c.name for c in s.completions()]
