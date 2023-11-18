import os

import pytest

from . import helpers


def assert_case_equal(case, actual, desired):
    """
    Assert ``actual == desired`` with formatted message.

    This is not needed for typical pytest use case, but as we need
    ``--assert=plain`` (see ../pytest.ini) to workaround some issue
    due to pytest magic, let's format the message by hand.
    """
    assert actual == desired, """
Test %r failed.
actual  = %s
desired = %s
""" % (case, actual, desired)


def assert_static_analysis(case, actual, desired):
    """A nicer formatting for static analysis tests."""
    a = set(actual)
    d = set(desired)
    assert actual == desired, """
Test %r failed.
not raised  = %s
unspecified = %s
""" % (case, sorted(d - a), sorted(a - d))


def test_completion(case, monkeypatch, environment, has_typing):
    skip_reason = case.get_skip_reason(environment)
    if skip_reason is not None:
        pytest.skip(skip_reason)

    _CONTAINS_TYPING = ('pep0484_typing', 'pep0484_comments', 'pep0526_variables')
    if not has_typing and any(x in case.path for x in _CONTAINS_TYPING):
        pytest.skip('Needs the typing module installed to run this test.')
    repo_root = helpers.root_dir
    monkeypatch.chdir(os.path.join(repo_root, 'jedi'))
    case.run(assert_case_equal, environment)


def test_static_analysis(static_analysis_case, environment):
    skip_reason = static_analysis_case.get_skip_reason(environment)
    if skip_reason is not None:
        pytest.skip(skip_reason)
    else:
        static_analysis_case.run(assert_static_analysis, environment)


def test_refactor(refactor_case):
    """
    Run refactoring test case.

    :type refactor_case: :class:`.refactor.RefactoringCase`
    """
    if 0:
        # TODO Refactoring is not relevant at the moment, it will be changed
        # significantly in the future, but maybe we can use these tests:
        refactor_case.run()
        assert_case_equal(refactor_case,
                          refactor_case.result, refactor_case.desired)
