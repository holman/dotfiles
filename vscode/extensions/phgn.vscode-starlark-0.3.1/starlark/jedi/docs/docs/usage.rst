.. include:: ../global.rst

End User Usage
==============

If you are a not an IDE Developer, the odds are that you just want to use
|jedi| as a browser plugin or in the shell. Yes that's :ref:`also possible
<repl-completion>`!

|jedi| is relatively young and can be used in a variety of Plugins and
Software. If your Editor/IDE is not among them, recommend |jedi| to your IDE
developers.


.. _editor-plugins:

Editor Plugins
--------------

Vim:

- jedi-vim_
- YouCompleteMe_
- deoplete-jedi_

Emacs:

- Jedi.el_
- elpy_
- anaconda-mode_

Sublime Text 2/3:

- SublimeJEDI_ (ST2 & ST3)
- anaconda_ (only ST3)

SynWrite:

- SynJedi_

TextMate:

- Textmate_ (Not sure if it's actually working)

Kate:

- Kate_ version 4.13+ `supports it natively
  <https://projects.kde.org/projects/kde/applications/kate/repository/entry/addons/kate/pate/src/plugins/python_autocomplete_jedi.py?rev=KDE%2F4.13>`__,
  you have to enable it, though.

Visual Studio Code:

- `Python Extension`_

Atom:

- autocomplete-python-jedi_

GNOME Builder:

- `GNOME Builder`_ `supports it natively
  <https://git.gnome.org/browse/gnome-builder/tree/plugins/jedi>`__,
  and is enabled by default.

Gedit:

- gedi_

Eric IDE:

- `Eric IDE`_ (Available as a plugin)

Web Debugger:

- wdb_

and many more!

.. _repl-completion:

Tab Completion in the Python Shell
----------------------------------

Starting with Ipython `6.0.0` Jedi is a dependency of IPython. Autocompletion
in IPython is therefore possible without additional configuration.

There are two different options how you can use Jedi autocompletion in
your Python interpreter. One with your custom ``$HOME/.pythonrc.py`` file
and one that uses ``PYTHONSTARTUP``.

Using ``PYTHONSTARTUP``
~~~~~~~~~~~~~~~~~~~~~~~

.. automodule:: jedi.api.replstartup

Using a custom ``$HOME/.pythonrc.py``
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. autofunction:: jedi.utils.setup_readline

.. _jedi-vim: https://github.com/davidhalter/jedi-vim
.. _youcompleteme: https://valloric.github.io/YouCompleteMe/
.. _deoplete-jedi: https://github.com/zchee/deoplete-jedi
.. _Jedi.el: https://github.com/tkf/emacs-jedi
.. _elpy: https://github.com/jorgenschaefer/elpy
.. _anaconda-mode: https://github.com/proofit404/anaconda-mode
.. _sublimejedi: https://github.com/srusskih/SublimeJEDI
.. _anaconda: https://github.com/DamnWidget/anaconda
.. _SynJedi: http://uvviewsoft.com/synjedi/
.. _wdb: https://github.com/Kozea/wdb
.. _TextMate: https://github.com/lawrenceakka/python-jedi.tmbundle
.. _kate: https://kate-editor.org/
.. _autocomplete-python-jedi: https://atom.io/packages/autocomplete-python-jedi
.. _GNOME Builder: https://wiki.gnome.org/Apps/Builder/
.. _gedi: https://github.com/isamert/gedi
.. _Eric IDE: https://eric-ide.python-projects.org
.. _Python Extension: https://marketplace.visualstudio.com/items?itemName=donjayamanne.python
