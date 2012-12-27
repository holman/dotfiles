import sys
import os

import mock

import sublime

import sublime_lib.view as su_lib_view


def test_append():
    view = mock.Mock()

    edit = object()
    view.begin_edit.return_value = edit
    view.size.return_value = 100
    su_lib_view.append(view, "new text")
    assert view.insert.call_args == ((edit, 100, "new text"),)


def test_in_one_edit():
    view = mock.Mock()

    edit = object()
    view.begin_edit.return_value = edit
    with su_lib_view.in_one_edit(view) as x:
        assert x is edit
    assert view.end_edit.call_args == ((edit,),)


def test_has_file_ext():
    view = mock.Mock()

    view.file_name.return_value = "foo.bar"
    assert su_lib_view.has_file_ext(view, "bar")

    view.file_name.return_value = 'foo.'
    assert not su_lib_view.has_file_ext(view, ".")

    view.file_name.return_value = ''
    assert not su_lib_view.has_file_ext(view, ".")

    view.file_name.return_value = ''
    assert not su_lib_view.has_file_ext(view, '')    

    view.file_name.return_value = 'foo'
    assert not su_lib_view.has_file_ext(view, '')

    view.file_name.return_value = 'foo'
    assert not su_lib_view.has_file_ext(view, 'foo')

    view.file_name.return_value = None
    assert not su_lib_view.has_file_ext(view, None)

    view.file_name.return_value = None
    assert not su_lib_view.has_file_ext(view, '.any')


def test_has_sels():
    view = mock.Mock()
    view.sel.return_value = range(1)

    assert su_lib_view.has_sels(view)