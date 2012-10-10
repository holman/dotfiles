#!/usr/bin/env python

"""
Simple desktop window enumeration for Python.

Copyright (C) 2007, 2008, 2009 Paul Boddie <paul@boddie.org.uk>

This program is free software; you can redistribute it and/or modify it under
the terms of the GNU Lesser General Public License as published by the Free
Software Foundation; either version 3 of the License, or (at your option) any
later version.

This program is distributed in the hope that it will be useful, but WITHOUT
ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
FOR A PARTICULAR PURPOSE.  See the GNU Lesser General Public License for more
details.

You should have received a copy of the GNU Lesser General Public License along
with this program.  If not, see <http://www.gnu.org/licenses/>.

--------

Finding Open Windows on the Desktop
-----------------------------------

To obtain a list of windows, use the desktop.windows.list function as follows:

windows = desktop.windows.list()

To obtain the root window, typically the desktop background, use the
desktop.windows.root function as follows:

root = desktop.windows.root()

Each window object can be inspected through a number of methods. For example:

name = window.name()
width, height = window.size()
x, y = window.position()
child_windows = window.children()

See the desktop.windows.Window class for more information.
"""

from desktop import _is_x11, _get_x11_vars, _readfrom, use_desktop
import re

# System functions.

def _xwininfo(identifier, action):
    if identifier is None:
        args = "-root"
    else:
        args = "-id " + identifier

    s = _readfrom(_get_x11_vars() + "xwininfo %s -%s" % (args, action), shell=1)

    # Return a mapping of keys to values for the "stats" action.

    if action == "stats":
        d = {}
        for line in s.split("\n"):
            fields = line.split(":")
            if len(fields) < 2:
                continue
            key, value = fields[0].strip(), ":".join(fields[1:]).strip()
            d[key] = value

        return d

    # Otherwise, return the raw output.

    else:
        return s

def _get_int_properties(d, properties):
    results = []
    for property in properties:
        results.append(int(d[property]))
    return results

# Finder functions.

def find_all(name):
    return 1

def find_named(name):
    return name is not None

def find_by_name(name):
    return lambda n, t=name: n == t

# Window classes.
# NOTE: X11 is the only supported desktop so far.

class Window:

    "A window on the desktop."

    _name_pattern = re.compile(r':\s+\(.*?\)\s+[-0-9x+]+\s+[-0-9+]+$')
    _absent_names = "(has no name)", "(the root window) (has no name)"

    def __init__(self, identifier):

        "Initialise the window with the given 'identifier'."

        self.identifier = identifier

        # Finder methods (from above).

        self.find_all = find_all
        self.find_named = find_named
        self.find_by_name = find_by_name

    def __repr__(self):
        return "Window(%r)" % self.identifier

    # Methods which deal with the underlying commands.

    def _get_handle_and_name(self, text):
        fields = text.strip().split(" ")
        handle = fields[0]

        # Get the "<name>" part, stripping off the quotes.

        name = " ".join(fields[1:])
        if len(name) > 1 and name[0] == '"' and name[-1] == '"':
            name = name[1:-1]

        if name in self._absent_names:
            return handle, None
        else:
            return handle, name

    def _get_this_handle_and_name(self, line):
        fields = line.split(":")
        return self._get_handle_and_name(":".join(fields[1:]))

    def _get_descendant_handle_and_name(self, line):
        match = self._name_pattern.search(line)
        if match:
            return self._get_handle_and_name(line[:match.start()].strip())
        else:
            raise OSError, "Window information from %r did not contain window details." % line

    def _descendants(self, s, fn):
        handles = []
        adding = 0
        for line in s.split("\n"):
            if line.endswith("child:") or line.endswith("children:"):
                if not adding:
                    adding = 1
            elif adding and line:
                handle, name = self._get_descendant_handle_and_name(line)
                if fn(name):
                    handles.append(handle)
        return [Window(handle) for handle in handles]

    # Public methods.

    def children(self, all=0):

        """
        Return a list of windows which are children of this window. If the
        optional 'all' parameter is set to a true value, all such windows will
        be returned regardless of whether they have any name information.
        """

        s = _xwininfo(self.identifier, "children")
        return self._descendants(s, all and self.find_all or self.find_named)

    def descendants(self, all=0):

        """
        Return a list of windows which are descendants of this window. If the
        optional 'all' parameter is set to a true value, all such windows will
        be returned regardless of whether they have any name information.
        """

        s = _xwininfo(self.identifier, "tree")
        return self._descendants(s, all and self.find_all or self.find_named)

    def find(self, callable):

        """
        Return windows using the given 'callable' (returning a true or a false
        value when invoked with a window name) for descendants of this window.
        """

        s = _xwininfo(self.identifier, "tree")
        return self._descendants(s, callable)

    def name(self):

        "Return the name of the window."

        d = _xwininfo(self.identifier, "stats")

        # Format is 'xwininfo: Window id: <handle> "<name>"

        return self._get_this_handle_and_name(d["xwininfo"])[1]

    def size(self):

        "Return a tuple containing the width and height of this window."

        d = _xwininfo(self.identifier, "stats")
        return _get_int_properties(d, ["Width", "Height"])

    def position(self):

        "Return a tuple containing the upper left co-ordinates of this window."

        d = _xwininfo(self.identifier, "stats")
        return _get_int_properties(d, ["Absolute upper-left X", "Absolute upper-left Y"])

    def displayed(self):

        """
        Return whether the window is displayed in some way (but not necessarily
        visible on the current screen).
        """

        d = _xwininfo(self.identifier, "stats")
        return d["Map State"] != "IsUnviewable"

    def visible(self):

        "Return whether the window is displayed and visible."

        d = _xwininfo(self.identifier, "stats")
        return d["Map State"] == "IsViewable"

def list(desktop=None):

    """
    Return a list of windows for the current desktop. If the optional 'desktop'
    parameter is specified then attempt to use that particular desktop
    environment's mechanisms to look for windows.
    """

    root_window = root(desktop)
    window_list = [window for window in root_window.descendants() if window.displayed()]
    window_list.insert(0, root_window)
    return window_list

def root(desktop=None):

    """
    Return the root window for the current desktop. If the optional 'desktop'
    parameter is specified then attempt to use that particular desktop
    environment's mechanisms to look for windows.
    """

    # NOTE: The desktop parameter is currently ignored and X11 is tested for
    # NOTE: directly.

    if _is_x11():
        return Window(None)
    else:
        raise OSError, "Desktop '%s' not supported" % use_desktop(desktop)

def find(callable, desktop=None):

    """
    Find and return windows using the given 'callable' for the current desktop.
    If the optional 'desktop' parameter is specified then attempt to use that
    particular desktop environment's mechanisms to look for windows.
    """

    return root(desktop).find(callable)

# vim: tabstop=4 expandtab shiftwidth=4
