#!/usr/bin/env python
r"""Test runner for typeshed.

Depends on pytype being installed.

If pytype is installed:
    1. For every pyi, do nothing if it is in pytype_blacklist.txt.
    2. Otherwise, call 'pytype.io.parse_pyi'.
Option two will load the file and all the builtins, typeshed dependencies. This
will also discover incorrect usage of imported modules.
"""

import argparse
import collections
import itertools
import os
from pytype import config
from pytype import io
import re
import subprocess
import sys
import traceback

parser = argparse.ArgumentParser(description='Pytype/typeshed tests.')
parser.add_argument('-n', '--dry-run', action='store_true', default=False,
                    help='Don\'t actually run tests')
# Default to '' so that symlinking typeshed subdirs in cwd will work.
parser.add_argument('--typeshed-location', type=str, default='',
                    help='Path to typeshed installation.')
# Set to true to print a stack trace every time an exception is thrown.
parser.add_argument('--print-stderr', action='store_true', default=False,
                    help='Print stderr every time an error is encountered.')
# We need to invoke python2.7 and 3.6.
parser.add_argument('--python27-exe', type=str, default='python2.7',
                    help='Path to a python 2.7 interpreter.')
parser.add_argument('--python36-exe', type=str, default='python3.6',
                    help='Path to a python 3.6 interpreter.')


TYPESHED_SUBDIRS = ['stdlib', 'third_party']


TYPESHED_HOME = 'TYPESHED_HOME'
UNSET = object()  # marker for tracking the TYPESHED_HOME environment variable


def main():
    args = parser.parse_args()
    code = pytype_test(args)
    sys.exit(code)


class PathMatcher(object):
    def __init__(self, patterns):
        if patterns:
            self.matcher = re.compile('(%s)$' % '|'.join(patterns))
        else:
            self.matcher = None

    def search(self, path):
        if not self.matcher:
            return False
        return self.matcher.search(path)


def load_blacklist(typeshed_location):
    filename = os.path.join(typeshed_location, 'tests', 'pytype_blacklist.txt')
    skip_re = re.compile(r'^\s*([^\s#]+)\s*(?:#.*)?$')
    skip = []

    with open(filename) as f:
        for line in f:
            skip_match = skip_re.match(line)
            if skip_match:
                skip.append(skip_match.group(1))

    return skip


def run_pytype(args, dry_run, typeshed_location):
    """Runs pytype, returning the stderr if any."""
    if dry_run:
        return None
    old_typeshed_home = os.environ.get(TYPESHED_HOME, UNSET)
    os.environ[TYPESHED_HOME] = typeshed_location
    try:
        io.parse_pyi(config.Options(args))
    except Exception:
        stderr = traceback.format_exc()
    else:
        stderr = None
    if old_typeshed_home is UNSET:
        del os.environ[TYPESHED_HOME]
    else:
        os.environ[TYPESHED_HOME] = old_typeshed_home
    return stderr


def _get_relative(filename):
    top = 0
    for d in TYPESHED_SUBDIRS:
        try:
            top = filename.index(d)
        except ValueError:
            continue
        else:
            break
    return filename[top:]


def _get_module_name(filename):
    """Converts a filename {subdir}/m.n/module/foo to module.foo."""
    return '.'.join(_get_relative(filename).split(os.path.sep)[2:]).replace(
        '.pyi', '').replace('.__init__', '')


def can_run(path, exe, *args):
    exe = os.path.join(path, exe)
    try:
        subprocess.Popen(
            [exe] + list(args), stdout=subprocess.PIPE, stderr=subprocess.PIPE
        ).communicate()
        return True
    except OSError:
        return False


def _is_version(path, version):
    return any('%s/%s' % (d, version) in path for d in TYPESHED_SUBDIRS)


def pytype_test(args):
    """Test with pytype, returning 0 for success and 1 for failure."""
    typeshed_location = args.typeshed_location or os.getcwd()
    paths = [os.path.join(typeshed_location, d) for d in TYPESHED_SUBDIRS]

    for p in paths:
        if not os.path.isdir(p):
            print('Cannot find typeshed subdir at %s '
                  '(specify parent dir via --typeshed-location)' % p)
            return 1

    for python_version_str in ('27', '36'):
        dest = 'python%s_exe' % python_version_str
        version = '.'.join(list(python_version_str))
        arg = '--python%s-exe' % python_version_str
        if not can_run('', getattr(args, dest), '--version'):
            print('Cannot run Python {version}. (point to a valid executable '
                  'via {arg})'.format(version=version, arg=arg))
            return 1

    skipped = PathMatcher(load_blacklist(typeshed_location))
    files = []
    bad = []

    def _parse(filename, major_version):
        if major_version == 3:
            version = '3.6'
            exe = args.python36_exe
        else:
            version = '2.7'
            exe = args.python27_exe
        options = [
            '--module-name=%s' % _get_module_name(filename),
            '--parse-pyi',
            '-V %s' % version,
            '--python_exe=%s' % exe,
        ]
        return run_pytype(options + [filename],
                          dry_run=args.dry_run,
                          typeshed_location=typeshed_location)

    for root, _, filenames in itertools.chain.from_iterable(
            os.walk(p) for p in paths):
        for f in sorted(f for f in filenames if f.endswith('.pyi')):
            f = os.path.join(root, f)
            rel = _get_relative(f)
            if not skipped.search(rel):
                if _is_version(f, '2and3'):
                    files.append((f, 2))
                    files.append((f, 3))
                elif _is_version(f, '2'):
                    files.append((f, 2))
                elif _is_version(f, '3'):
                    files.append((f, 3))
                else:
                    print('Unrecognized path: %s' % f)

    errors = 0
    total_tests = len(files)
    print('Testing files with pytype...')
    for i, (f, version) in enumerate(files):
        stderr = _parse(f, version)
        if stderr:
            if args.print_stderr:
                print(stderr)
            errors += 1
            # We strip off the stack trace and just leave the last line with the
            # actual error; to see the stack traces use --print_stderr.
            bad.append((_get_relative(f), stderr.rstrip().rsplit('\n', 1)[-1]))

        runs = i + 1
        if runs % 25 == 0:
            print('  %3d/%d with %3d errors' % (runs, total_tests, errors))

    print('Ran pytype with %d pyis, got %d errors.' % (total_tests, errors))
    for f, err in bad:
        print('%s: %s' % (f, err))
    return int(bool(errors))


if __name__ == '__main__':
    main()
