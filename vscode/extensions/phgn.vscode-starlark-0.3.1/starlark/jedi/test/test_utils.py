try:
    import readline
except ImportError:
    readline = False

from jedi import utils

from .helpers import unittest, cwd_at


@unittest.skipIf(not readline, "readline not found")
class TestSetupReadline(unittest.TestCase):
    class NameSpace(object):
        pass

    def __init__(self, *args, **kwargs):
        super(type(self), self).__init__(*args, **kwargs)

        self.namespace = self.NameSpace()
        utils.setup_readline(self.namespace)

    def completions(self, text):
        completer = readline.get_completer()
        i = 0
        completions = []
        while True:
            completion = completer(text, i)
            if completion is None:
                break
            completions.append(completion)
            i += 1
        return completions

    def test_simple(self):
        assert self.completions('list') == ['list']
        assert self.completions('importerror') == ['ImportError']
        s = "print(BaseE"
        assert self.completions(s) == [s + 'xception']

    def test_nested(self):
        assert self.completions('list.Insert') == ['list.insert']
        assert self.completions('list().Insert') == ['list().insert']

    def test_magic_methods(self):
        assert self.completions('list.__getitem__') == ['list.__getitem__']
        assert self.completions('list().__getitem__') == ['list().__getitem__']

    def test_modules(self):
        import sys
        import os
        self.namespace.sys = sys
        self.namespace.os = os

        try:
            assert self.completions('os.path.join') == ['os.path.join']
            string = 'os.path.join("a").upper'
            assert self.completions(string) == [string]

            c = {'os.' + d for d in dir(os) if d.startswith('ch')}
            assert set(self.completions('os.ch')) == set(c)
        finally:
            del self.namespace.sys
            del self.namespace.os

    def test_calls(self):
        s = 'str(bytes'
        assert self.completions(s) == [s, 'str(BytesWarning']

    def test_import(self):
        s = 'from os.path import a'
        assert set(self.completions(s)) == {s + 'ltsep', s + 'bspath'}
        assert self.completions('import keyword') == ['import keyword']

        import os
        s = 'from os import '
        goal = {s + el for el in dir(os)}
        # There are minor differences, e.g. the dir doesn't include deleted
        # items as well as items that are not only available on linux.
        difference = set(self.completions(s)).symmetric_difference(goal)
        difference = {x for x in difference if not x.startswith('from os import _')}
        # There are quite a few differences, because both Windows and Linux
        # (posix and nt) libraries are included.
        assert len(difference) < 38

    @cwd_at('test')
    def test_local_import(self):
        s = 'import test_utils'
        assert self.completions(s) == [s]

    def test_preexisting_values(self):
        self.namespace.a = range(10)
        assert set(self.completions('a.')) == {'a.' + n for n in dir(range(1))}
        del self.namespace.a

    def test_colorama(self):
        """
        Only test it if colorama library is available.

        This module is being tested because it uses ``setattr`` at some point,
        which Jedi doesn't understand, but it should still work in the REPL.
        """
        try:
            # if colorama is installed
            import colorama
        except ImportError:
            pass
        else:
            self.namespace.colorama = colorama
            assert self.completions('colorama')
            assert self.completions('colorama.Fore.BLACK') == ['colorama.Fore.BLACK']
            del self.namespace.colorama


def test_version_info():
    assert utils.version_info()[:2] > (0, 7)
