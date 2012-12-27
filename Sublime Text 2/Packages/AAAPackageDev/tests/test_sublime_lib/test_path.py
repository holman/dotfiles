import sys
import os

import mock

import sublime

import sublime_lib.path as su_path


def test_root_at_packages():
    sublime.packages_path = mock.Mock()
    sublime.packages_path.return_value = "XXX"
    expected = os.path.join("XXX", "ZZZ")
    assert su_path.root_at_packages("ZZZ") == expected


def test_root_at_data():
    sublime.packages_path = mock.Mock()
    sublime.packages_path.return_value = "XXX\\YYY"
    expected = os.path.join("XXX", "ZZZ")
    assert su_path.root_at_data("ZZZ") == expected
