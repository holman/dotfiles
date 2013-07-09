=============
AAAPackageDev
=============

status: beta

Overview
========

AAAPackageDev helps create and edit snippets, completions files, build systems
and other Sublime Text extensions.

The general workflow looks like this:

- run ``new_*`` command (``new_raw_snippet``, ``new_completions``, ``new_syntax_def``...)
- edit file (with specific snippets, completions, higlighting, build systems...)
- save file

AAAPackageDev ``new_*`` commands are typically accessible through the *Command
Palette* (``Ctrl+Shift+P``).


Getting Started
===============

#. Download and install `AAAPackageDev`_. (See `installation instructions`_ for ``.sublime-package`` files.)
#. Access commands from **Tools | Packages | Package Development** or the *Command Palette* (``Ctrl+Shift+P``).

.. _AAAPackageDev: https://bitbucket.org/guillermooo/aaapackagedev/downloads/AAAPackageDev.sublime-package
.. _installation instructions: http://sublimetext.info/docs/en/extensibility/packages.html#installation-of-packages


Syntax Definition Development
=============================

In AAAPackageDev, syntax definitions are written in JSON. Because Sublime Text
uses ``.tmLanguage`` files, though, they need to be converted before use. The
conversion is done through the included build system ``JSON to Property List``.

Creating a New Syntax Definition
********************************

#. Create new template (through **Tools | Packages | Package Development**) or the *Command Palette*
#. Select ``JSON to Property List`` build system from **Tools | Build System** or leave as ``Automatic``
#. Press ``F7``


Other included resources for syntax definition development:

* Snippets


Package Development
===================

Resources for package development are in a very early stage.

Commands
********

``new_package``
	Window command. Prompts for a name and creates a new package skeleton in ``Packages``.

``delete_package``
	Window command. Opens file browser at ``Packages``.


.. Completions
.. -----------
..
.. * sublime text plugin dev (off by default)
.. Will clutter your completions list in any kind of python dev.
.. To turn on, change scope selector to ``source.python``.


Build System Development
========================

* Syntax definition for ``.build-system`` files.


Key Map Development
===================

* Syntax definition for ``.sublime-keymap`` files.
* Completions
* Snippets


Snippet Development
===================

AAAPackageDev provides a means to edit snippets using snippets. These snippets
are called *raw snippets*. You can use snippets and snippet-like syntax in many
files, but if you want to create ``.sublime-snippet`` files, you need to convert
raw snippets first. This converion is done with a command.

Inside ``AAAPackageDev/Support`` you will find a ``.sublime-keymap`` file.
The key bindings in it are included for reference. If you want them to work,
you need to copy the contents over to your personal ``.sublime-keymap`` file
under ``Packages/User``.

Creating Snippets
*****************

#. Create new raw snippet with included commands (**Tools | Packages | Package Development** or *Command Palette*)
#. Edit snippet
#. If needed, convert to ``.sublime-snippet`` with included command

You can use raw snippets directly in some files, like ``.sublime-completions`` files.


Completions Development
=======================

* Syntax definition for ``.sublime-completions`` files
* Snippets

You can use raw snippets directly in the ``contents`` element of a trigger-based
completion.


Settings File Development
=========================

* Syntax definition for ``.sublime-settings`` files
* Snippets


JSON and Property List Conversion
=================================

If you need to parse a ``.plist`` into a ``.json`` file or vice versa AAAPackageDev
can also be of help.

Commands
********

``json_to_plist`` (Palette: ``JSON to Property List``)
    This command has already been mentioned in the Syntax Definition section, but it
    is not stated that this command in fact works for almost any JSON file you can imagine.

    It considers the current file's filename and adjusts the target filename accordingly.

    * ``I am json.json`` will be parsed into ``I am json.plist``.
    * ``I am json.JSON-propertyList`` will be parsed into ``I am json.propertyList``.

``plist_to_json`` (Palette: ``Property List to JSON``)
    This command is just the reverse of the above. Considers the current file's filename
    similarly and adjusts the target filename. However, if your file's extension is not
    ``.plist`` you need the doctype ``<!DOCTYPE plist`` at the beginning in one of the
    first two lines in order to use this command, otherwise it will assume that you don't
    have a Property List open.

    Please note:
        Non-native JSON data types (such as <date> or <data>) result in unpredictable
        behavior. Floats types (<float> or <real>) tend to lose precision when being cast into
        Python data types.

    * ``I am json.plist`` will be parsed into ``I am json.json``.
    * ``I am json.propertyList`` will be parsed into ``I am json.JSON-propertyList`` *only
      if the doctype* ``<!DOCTYPE plist`` *is specified*.


About Snippets in AAAPackageDev
===============================

The ``AAAPackageDev/Snippets`` folder contains many snippets for all kinds of
development mentioned above. These snippets follow memorable rules to make their
use easy.

The snippets used more often have short tab triggers like ``f`` (*field*),
``c`` (*completion*), ``k`` (*key binding*), etc. In cases where increasingly
complex items of a similar kind might exist (numbered fields, fields with place
holders and fields with substitutions in the case of snippets), their tab triggers
will consist in a repeated character, like ``f``, ``ff`` and ``fff``.

As a rule of thumb, the more complex the snippet, the longer its tab trigger.

            Also, ``i`` (for *item*) is often a generic synonym for the most common snippet
in a type of file. In such cases, ``ii`` and even longer tab triggers might work
too for consistency.


Sublime Library
===============

AAAPackageDev includes ``sublime_lib``, a Python package with utilities for
plugin developers. Once AAAPackageDev is installed, ``sublime_lib`` will be
importable from any plugin residing in ``Packages``.
