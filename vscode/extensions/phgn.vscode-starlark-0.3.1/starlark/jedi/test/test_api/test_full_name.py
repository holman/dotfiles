"""
Tests for :attr:`.BaseDefinition.full_name`.

There are three kinds of test:

#. Test classes derived from :class:`MixinTestFullName`.
   Child class defines :attr:`.operation` to alter how
   the api definition instance is created.

#. :class:`TestFullDefinedName` is to test combination of
   ``obj.full_name`` and ``jedi.defined_names``.

#. Misc single-function tests.
"""

import textwrap

import pytest

import jedi
from ..helpers import TestCase


class MixinTestFullName(object):
    operation = None

    @pytest.fixture(autouse=True)
    def init(self, Script, environment):
        self.Script = Script
        self.environment = environment

    def check(self, source, desired):
        script = self.Script(textwrap.dedent(source))
        definitions = getattr(script, type(self).operation)()
        for d in definitions:
            self.assertEqual(d.full_name, desired)

    def test_os_path_join(self):
        self.check('import os; os.path.join', 'os.path.join')

    def test_builtin(self):
        self.check('TypeError', 'builtins.TypeError')


class TestFullNameWithGotoDefinitions(MixinTestFullName, TestCase):
    operation = 'goto_definitions'

    def test_tuple_mapping(self):
        if self.environment.version_info.major == 2:
            pytest.skip('Python 2 also yields None.')

        self.check("""
        import re
        any_re = re.compile('.*')
        any_re""", 'typing.Pattern')

    def test_from_import(self):
        self.check('from os import path', 'os.path')


class TestFullNameWithCompletions(MixinTestFullName, TestCase):
    operation = 'completions'


class TestFullDefinedName(TestCase):
    """
    Test combination of ``obj.full_name`` and ``jedi.defined_names``.
    """
    @pytest.fixture(autouse=True)
    def init(self, environment):
        self.environment = environment

    def check(self, source, desired):
        definitions = jedi.names(textwrap.dedent(source), environment=self.environment)
        full_names = [d.full_name for d in definitions]
        self.assertEqual(full_names, desired)

    def test_local_names(self):
        self.check("""
        def f(): pass
        class C: pass
        """, ['__main__.f', '__main__.C'])

    def test_imports(self):
        self.check("""
        import os
        from os import path
        from os.path import join
        from os import path as opath
        """, ['os', 'os.path', 'os.path.join', 'os.path'])


def test_sub_module(Script, jedi_path):
    """
    ``full_name needs to check sys.path to actually find it's real path module
    path.
    """
    sys_path = [jedi_path]
    defs = Script('from jedi.api import classes; classes', sys_path=sys_path).goto_definitions()
    assert [d.full_name for d in defs] == ['jedi.api.classes']
    defs = Script('import jedi.api; jedi.api', sys_path=sys_path).goto_definitions()
    assert [d.full_name for d in defs] == ['jedi.api']


def test_os_path(Script):
    d, = Script('from os.path import join').completions()
    assert d.full_name == 'os.path.join'
    d, = Script('import os.p').completions()
    assert d.full_name == 'os.path'


def test_os_issues(Script):
    """Issue #873"""
    assert [c.name for c in Script('import os\nos.nt''').completions()] == ['nt']
