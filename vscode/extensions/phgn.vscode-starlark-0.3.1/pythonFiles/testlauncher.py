# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License.

import os
import sys


def parse_argv():
    """Parses arguments for use with the test launcher.
    Arguments are:
    1. Working directory.
    2. Test runner, `pytest` or `nose`
    3. Rest of the arguments are passed into the test runner.
    """

    return (sys.argv[1], sys.argv[2], sys.argv[3:])


def exclude_current_file_from_debugger():
    # Load the debugger package
    try:
        import ptvsd
    except:
        traceback.print_exc()
        print('''
Internal error detected. Please copy the above traceback and report at
https://github.com/Microsoft/vscode-python/issues/new

Press Enter to close. . .''')
        try:
            raw_input()
        except NameError:
            input()
        sys.exit(1)


def run(cwd, testRunner, args):
    """Runs the test
    cwd -- the current directory to be set
    testRunner -- test runner to be used `pytest` or `nose`
    args -- arguments passed into the test runner
    """
    
    sys.path[0] = os.getcwd()
    os.chdir(cwd)

    try:
        if testRunner == 'pytest':
            import pytest
            pytest.main(args)
        else:
            import nose
            nose.run(argv=args)
        sys.exit(0)
    finally:
        pass


if __name__ == '__main__':
    exclude_current_file_from_debugger()
    cwd, testRunner, args = parse_argv()
    run(cwd, testRunner, args)
