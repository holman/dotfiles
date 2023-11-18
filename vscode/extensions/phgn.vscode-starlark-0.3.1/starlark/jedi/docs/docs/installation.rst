.. include:: ../global.rst

Installation and Configuration
==============================

You can either include |jedi| as a submodule in your text editor plugin (like
jedi-vim_ does by default), or you can install it systemwide.

.. note:: This just installs the |jedi| library, not the :ref:`editor plugins
    <editor-plugins>`. For information about how to make it work with your
    editor, refer to the corresponding documentation.


The normal way
--------------

Most people use Jedi with a :ref:`editor plugins<editor-plugins>`. Typically
you install Jedi by installing an editor plugin. No necessary steps are needed.
Just take a look at the instructions for the plugin.


With pip
--------

On any system you can install |jedi| directly from the Python package index
using pip::

    sudo pip install jedi

If you want to install the current development version (master branch)::

    sudo pip install -e git://github.com/davidhalter/jedi.git#egg=jedi


System-wide installation via a package manager
----------------------------------------------

Arch Linux
~~~~~~~~~~

You can install |jedi| directly from official Arch Linux packages:

- `python-jedi <https://www.archlinux.org/packages/community/any/python-jedi/>`__
  (Python 3)
- `python2-jedi <https://www.archlinux.org/packages/community/any/python2-jedi/>`__
  (Python 2)

The specified Python version just refers to the *runtime environment* for
|jedi|. Use the Python 2 version if you're running vim (or whatever editor you
use) under Python 2. Otherwise, use the Python 3 version. But whatever version
you choose, both are able to complete both Python 2 and 3 *code*.

(There is also a packaged version of the vim plugin available: 
`vim-jedi at Arch Linux <https://www.archlinux.org/packages/community/any/vim-jedi/>`__.)

Debian
~~~~~~

Debian packages are available in the `unstable repository
<https://packages.debian.org/search?keywords=python%20jedi>`__.

Others
~~~~~~

We are in the discussion of adding |jedi| to the Fedora repositories.


Manual installation from GitHub
---------------------------------------------

If you prefer not to use an automated package installer, you can clone the source from GitHub and install it manually. To install it, run these commands::

    git clone --recurse-submodules https://github.com/davidhalter/jedi
    cd jedi
    sudo python setup.py install

Inclusion as a submodule
------------------------

If you use an editor plugin like jedi-vim_, you can simply include |jedi| as a
git submodule of the plugin directory. Vim plugin managers like Vundle_ or
Pathogen_ make it very easy to keep submodules up to date.


.. _jedi-vim: https://github.com/davidhalter/jedi-vim
.. _vundle: https://github.com/gmarik/vundle
.. _pathogen: https://github.com/tpope/vim-pathogen
