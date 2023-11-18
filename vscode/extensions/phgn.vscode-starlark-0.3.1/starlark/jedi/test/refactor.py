#!/usr/bin/env python
"""
Refactoring tests work a little bit similar to Black Box tests. But the idea is
here to compare two versions of code. **Note: Refactoring is currently not in
active development (and was never stable), the tests are therefore not really
valuable - just ignore them.**
"""
from __future__ import with_statement
import os
import re

from functools import reduce
import jedi
from jedi import refactoring


class RefactoringCase(object):

    def __init__(self, name, source, line_nr, index, path,
                 new_name, start_line_test, desired):
        self.name = name
        self.source = source
        self.line_nr = line_nr
        self.index = index
        self.path = path
        self.new_name = new_name
        self.start_line_test = start_line_test
        self.desired = desired

    def refactor(self):
        script = jedi.Script(self.source, self.line_nr, self.index, self.path)
        f_name = os.path.basename(self.path)
        refactor_func = getattr(refactoring, f_name.replace('.py', ''))
        args = (self.new_name,) if self.new_name else ()
        return refactor_func(script, *args)

    def run(self):
        refactor_object = self.refactor()

        # try to get the right excerpt of the newfile
        f = refactor_object.new_files()[self.path]
        lines = f.splitlines()[self.start_line_test:]

        end = self.start_line_test + len(lines)
        pop_start = None
        for i, l in enumerate(lines):
            if l.startswith('# +++'):
                end = i
                break
            elif '#? ' in l:
                pop_start = i
        lines.pop(pop_start)
        self.result = '\n'.join(lines[:end - 1]).strip()
        return self.result

    def check(self):
        return self.run() == self.desired

    def __repr__(self):
        return '<%s: %s:%s>' % (self.__class__.__name__,
                                self.name, self.line_nr - 1)


def collect_file_tests(source, path, lines_to_execute):
    r = r'^# --- ?([^\n]*)\n((?:(?!\n# \+\+\+).)*)' \
        r'\n# \+\+\+((?:(?!\n# ---).)*)'
    for match in re.finditer(r, source, re.DOTALL | re.MULTILINE):
        name = match.group(1).strip()
        first = match.group(2).strip()
        second = match.group(3).strip()
        start_line_test = source[:match.start()].count('\n') + 1

        # get the line with the position of the operation
        p = re.match(r'((?:(?!#\?).)*)#\? (\d*) ?([^\n]*)', first, re.DOTALL)
        if p is None:
            print("Please add a test start.")
            continue
        until = p.group(1)
        index = int(p.group(2))
        new_name = p.group(3)

        line_nr = start_line_test + until.count('\n') + 2
        if lines_to_execute and line_nr - 1 not in lines_to_execute:
            continue

        yield RefactoringCase(name, source, line_nr, index, path,
                              new_name, start_line_test, second)


def collect_dir_tests(base_dir, test_files):
    for f_name in os.listdir(base_dir):
        files_to_execute = [a for a in test_files.items() if a[0] in f_name]
        lines_to_execute = reduce(lambda x, y: x + y[1], files_to_execute, [])
        if f_name.endswith(".py") and (not test_files or files_to_execute):
            path = os.path.join(base_dir, f_name)
            with open(path) as f:
                source = f.read()
            for case in collect_file_tests(source, path, lines_to_execute):
                yield case
