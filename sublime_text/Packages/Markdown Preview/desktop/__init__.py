#!/usr/bin/env python

"""
Simple desktop integration for Python. This module provides desktop environment
detection and resource opening support for a selection of common and
standardised desktop environments.

Copyright (C) 2005, 2006, 2007, 2008, 2009 Paul Boddie <paul@boddie.org.uk>

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

Desktop Detection
-----------------

To detect a specific desktop environment, use the get_desktop function.
To detect whether the desktop environment is standardised (according to the
proposed DESKTOP_LAUNCH standard), use the is_standard function.

Opening URLs
------------

To open a URL in the current desktop environment, relying on the automatic
detection of that environment, use the desktop.open function as follows:

desktop.open("http://www.python.org")

To override the detected desktop, specify the desktop parameter to the open
function as follows:

desktop.open("http://www.python.org", "KDE") # Insists on KDE
desktop.open("http://www.python.org", "GNOME") # Insists on GNOME
desktop.open("http://www.python.org", "MATE") # Insists on MATE

Without overriding using the desktop parameter, the open function will attempt
to use the "standard" desktop opening mechanism which is controlled by the
DESKTOP_LAUNCH environment variable as described below.

The DESKTOP_LAUNCH Environment Variable
---------------------------------------

The DESKTOP_LAUNCH environment variable must be shell-quoted where appropriate,
as shown in some of the following examples:

DESKTOP_LAUNCH="kdialog --msgbox"       Should present any opened URLs in
                                        their entirety in a KDE message box.
                                        (Command "kdialog" plus parameter.)
DESKTOP_LAUNCH="my\ opener"             Should run the "my opener" program to
                                        open URLs.
                                        (Command "my opener", no parameters.)
DESKTOP_LAUNCH="my\ opener --url"       Should run the "my opener" program to
                                        open URLs.
                                        (Command "my opener" plus parameter.)

Details of the DESKTOP_LAUNCH environment variable convention can be found here:
http://lists.freedesktop.org/archives/xdg/2004-August/004489.html

Other Modules
-------------

The desktop.dialog module provides support for opening dialogue boxes.
The desktop.windows module permits the inspection of desktop windows.
"""

__version__ = "0.4"

import os
import sys

# Provide suitable process creation functions.

try:
    import subprocess
    def _run(cmd, shell, wait):
        opener = subprocess.Popen(cmd, shell=shell)
        if wait: opener.wait()
        return opener.pid

    def _readfrom(cmd, shell):
        opener = subprocess.Popen(cmd, shell=shell, stdin=subprocess.PIPE, stdout=subprocess.PIPE)
        opener.stdin.close()
        return opener.stdout.read()

    def _status(cmd, shell):
        opener = subprocess.Popen(cmd, shell=shell)
        opener.wait()
        return opener.returncode == 0

except ImportError:
    import popen2
    def _run(cmd, shell, wait):
        opener = popen2.Popen3(cmd)
        if wait: opener.wait()
        return opener.pid

    def _readfrom(cmd, shell):
        opener = popen2.Popen3(cmd)
        opener.tochild.close()
        opener.childerr.close()
        return opener.fromchild.read()

    def _status(cmd, shell):
        opener = popen2.Popen3(cmd)
        opener.wait()
        return opener.poll() == 0

import commands

# Private functions.

def _get_x11_vars():

    "Return suitable environment definitions for X11."

    if not os.environ.get("DISPLAY", "").strip():
        return "DISPLAY=:0.0 "
    else:
        return ""

def _is_xfce():

    "Return whether XFCE is in use."

    # XFCE detection involves testing the output of a program.

    try:
        return _readfrom(_get_x11_vars() + "xprop -root _DT_SAVE_MODE", shell=1).strip().endswith(' = "xfce4"')
    except OSError:
        return 0

def _is_x11():

    "Return whether the X Window System is in use."

    return os.environ.has_key("DISPLAY")

# Introspection functions.

def get_desktop():

    """
    Detect the current desktop environment, returning the name of the
    environment. If no environment could be detected, None is returned.
    """

    if os.environ.has_key("KDE_FULL_SESSION") or \
        os.environ.has_key("KDE_MULTIHEAD"):
        return "KDE"
    elif os.environ.has_key("GNOME_DESKTOP_SESSION_ID") or \
        os.environ.has_key("GNOME_KEYRING_SOCKET"):
        return "GNOME"
    elif os.environ.has_key("MATE_DESKTOP_SESSION_ID") or \
        os.environ.has_key("MATE_KEYRING_SOCKET"):
        return "MATE"
    elif sys.platform == "darwin":
        return "Mac OS X"
    elif hasattr(os, "startfile"):
        return "Windows"
    elif _is_xfce():
        return "XFCE"

    # KDE, GNOME, MATE and XFCE run on X11, so we have to test for X11 last.

    if _is_x11():
        return "X11"
    else:
        return None

def use_desktop(desktop):

    """
    Decide which desktop should be used, based on the detected desktop and a
    supplied 'desktop' argument (which may be None). Return an identifier
    indicating the desktop type as being either "standard" or one of the results
    from the 'get_desktop' function.
    """

    # Attempt to detect a desktop environment.

    detected = get_desktop()

    # Start with desktops whose existence can be easily tested.

    if (desktop is None or desktop == "standard") and is_standard():
        return "standard"
    elif (desktop is None or desktop == "Windows") and detected == "Windows":
        return "Windows"

    # Test for desktops where the overriding is not verified.

    elif (desktop or detected) == "KDE":
        return "KDE"
    elif (desktop or detected) == "GNOME":
        return "GNOME"
    elif (desktop or detected) == "MATE":
        return "MATE"
    elif (desktop or detected) == "XFCE":
        return "XFCE"
    elif (desktop or detected) == "Mac OS X":
        return "Mac OS X"
    elif (desktop or detected) == "X11":
        return "X11"
    else:
        return None

def is_standard():

    """
    Return whether the current desktop supports standardised application
    launching.
    """

    return os.environ.has_key("DESKTOP_LAUNCH")

# Activity functions.

def open(url, desktop=None, wait=0):

    """
    Open the 'url' in the current desktop's preferred file browser. If the
    optional 'desktop' parameter is specified then attempt to use that
    particular desktop environment's mechanisms to open the 'url' instead of
    guessing or detecting which environment is being used.

    Suggested values for 'desktop' are "standard", "KDE", "GNOME", "GNOME",
    "XFCE", "Mac OS X", "Windows" where "standard" employs a DESKTOP_LAUNCH
    environment variable to open the specified 'url'. DESKTOP_LAUNCH should
    be a command, possibly followed by arguments, and must have any special
    characters shell-escaped.

    The process identifier of the "opener" (ie. viewer, editor, browser or
    program) associated with the 'url' is returned by this function. If the
    process identifier cannot be determined, None is returned.

    An optional 'wait' parameter is also available for advanced usage and, if
    'wait' is set to a true value, this function will wait for the launching
    mechanism to complete before returning (as opposed to immediately returning
    as is the default behaviour).
    """

    # Decide on the desktop environment in use.

    desktop_in_use = use_desktop(desktop)

    if desktop_in_use == "standard":
        arg = "".join([os.environ["DESKTOP_LAUNCH"], commands.mkarg(url)])
        return _run(arg, 1, wait)

    elif desktop_in_use == "Windows":
        # NOTE: This returns None in current implementations.
        return os.startfile(url)

    elif desktop_in_use == "KDE":
        cmd = ["xdg-open", url]

    elif desktop_in_use == "GNOME":
        cmd = ["xdg-open", url]

    elif desktop_in_use == "MATE":
        cmd = ["xdg-open", url]

    elif desktop_in_use == "XFCE":
        cmd = ["xdg-open", url]

    elif desktop_in_use == "Mac OS X":
        cmd = ["open", url]

    elif desktop_in_use == "X11" and os.environ.has_key("BROWSER"):
        cmd = [os.environ["BROWSER"], url]

    # Finish with an error where no suitable desktop was identified.

    else:
        raise OSError, "Desktop '%s' not supported (neither DESKTOP_LAUNCH nor os.startfile could be used)" % desktop_in_use

    return _run(cmd, 0, wait)

# vim: tabstop=4 expandtab shiftwidth=4
