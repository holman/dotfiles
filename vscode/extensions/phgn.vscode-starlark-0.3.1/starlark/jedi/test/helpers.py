"""
A helper module for testing, improves compatibility for testing (as
``jedi._compatibility``) as well as introducing helper functions.
"""

import sys
from contextlib import contextmanager

if sys.hexversion < 0x02070000:
    import unittest2 as unittest
else:
    import unittest
TestCase = unittest.TestCase

import os
import pytest
from os.path import abspath, dirname, join
from functools import partial, wraps

test_dir = dirname(abspath(__file__))
root_dir = dirname(test_dir)

sample_int = 1  # This is used in completion/imports.py

skip_if_windows = partial(pytest.param,
                          marks=pytest.mark.skipif("sys.platform=='win32'"))
skip_if_not_windows = partial(pytest.param,
                              marks=pytest.mark.skipif("sys.platform!='win32'"))


def get_example_dir(name):
    return join(test_dir, 'examples', name)


def cwd_at(path):
    """
    Decorator to run function at `path`.

    :type path: str
    :arg  path: relative path from repository root (e.g., ``'jedi'``).
    """
    def decorator(func):
        @wraps(func)
        def wrapper(Script, **kwargs):
            with set_cwd(path):
                return func(Script, **kwargs)
        return wrapper
    return decorator


@contextmanager
def set_cwd(path, absolute_path=False):
    repo_root = os.path.dirname(test_dir)

    oldcwd = os.getcwd()
    os.chdir(os.path.join(repo_root, path))
    try:
        yield
    finally:
        os.chdir(oldcwd)
