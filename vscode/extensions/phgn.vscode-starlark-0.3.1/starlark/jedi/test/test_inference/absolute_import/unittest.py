"""
This is a module that shadows a builtin (intentionally).

It imports a local module, which in turn imports stdlib unittest (the
name shadowed by this module). If that is properly resolved, there's
no problem. However, if jedi doesn't understand absolute_imports, it
will get this module again, causing infinite recursion.
"""
from local_module import Assertions


class TestCase(Assertions):
    def test(self):
        self.assertT
