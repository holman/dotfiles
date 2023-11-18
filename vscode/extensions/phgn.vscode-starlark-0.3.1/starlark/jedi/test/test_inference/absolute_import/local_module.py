"""
This is a module that imports the *standard library* unittest,
despite there being a local "unittest" module. It specifies that it
wants the stdlib one with the ``absolute_import`` __future__ import.

The twisted equivalent of this module is ``twisted.trial._synctest``.
"""
from __future__ import absolute_import

import unittest


class Assertions(unittest.TestCase):
    pass
