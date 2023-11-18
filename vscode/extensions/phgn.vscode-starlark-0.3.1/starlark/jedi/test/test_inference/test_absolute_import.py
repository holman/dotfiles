"""
Tests ``from __future__ import absolute_import`` (only important for
Python 2.X)
"""
from .. import helpers


@helpers.cwd_at("test/test_inference/absolute_import")
def test_can_complete_when_shadowing(Script):
    script = Script(path="unittest.py")
    assert script.completions()
