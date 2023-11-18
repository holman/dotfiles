.. include:: ../global.rst

Jedi Development
================

.. currentmodule:: jedi

.. note:: This documentation is for Jedi developers who want to improve Jedi
    itself, but have no idea how Jedi works. If you want to use Jedi for 
    your IDE, look at the `plugin api <api.html>`_.
    It is also important to note that it's a pretty old version and some things
    might not apply anymore.


Introduction
------------

This page tries to address the fundamental demand for documentation of the
|jedi| internals. Understanding a dynamic language is a complex task. Especially
because type inference in Python can be a very recursive task. Therefore |jedi|
couldn't get rid of complexity. I know that **simple is better than complex**,
but unfortunately it sometimes requires complex solutions to understand complex
systems.

Since most of the Jedi internals have been written by me (David Halter), this
introduction will be written mostly by me, because no one else understands to
the same level how Jedi works. Actually this is also the reason for exactly this
part of the documentation. To make multiple people able to edit the Jedi core.

In five chapters I'm trying to describe the internals of |jedi|:

- :ref:`The Jedi Core <core>`
- :ref:`Core Extensions <core-extensions>`
- :ref:`Imports & Modules <imports-modules>`
- :ref:`Caching & Recursions <caching-recursions>`
- :ref:`Helper modules <dev-helpers>`

.. note:: Testing is not documented here, you'll find that
   `right here <testing.html>`_.


.. _core:

The Jedi Core
-------------

The core of Jedi consists of three parts:

- :ref:`Parser <parser>`
- :ref:`Python type inference <inference>`
- :ref:`API <dev-api>`

Most people are probably interested in :ref:`type inference <inference>`,
because that's where all the magic happens. I need to introduce the :ref:`parser
<parser>` first, because :mod:`jedi.inference` uses it extensively.

.. _parser:

Parser
~~~~~~~~~~~~~~~~~~~~~~~~~~~

Jedi used to have it's internal parser, however this is now a separate project
and is called `parso <http://parso.readthedocs.io>`_.

The parser creates a syntax tree that |jedi| analyses and tries to understand.
The grammar that this parsers uses is very similar to the official Python
`grammar files <https://docs.python.org/3/reference/grammar.html>`_.

.. _inference:

Type inference of python code (inference/__init__.py)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. automodule:: jedi.inference

Inference Values (inference/base_value.py)
++++++++++++++++++++++++++++++++++++++++++++++++++++++

.. automodule:: jedi.inference.base_value

.. inheritance-diagram::
   jedi.inference.value.instance.TreeInstance
   jedi.inference.value.klass.Classvalue
   jedi.inference.value.function.FunctionValue
   jedi.inference.value.function.FunctionExecutionContext
   :parts: 1


.. _name_resolution:

Name resolution (inference/finder.py)
++++++++++++++++++++++++++++++++++++

.. automodule:: jedi.inference.finder


.. _dev-api:

API (api/__init__.py and api/classes.py)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The API has been designed to be as easy to use as possible. The API
documentation can be found `here <api.html>`_. The API itself contains
little code that needs to be mentioned here. Generally I'm trying to be
conservative with the API.  I'd rather not add new API features if they are not
necessary, because it's much harder to deprecate stuff than to add it later.


.. _core-extensions:

Core Extensions
---------------

Core Extensions is a summary of the following topics:

- :ref:`Iterables & Dynamic Arrays <iterables>`
- :ref:`Dynamic Parameters <dynamic>`
- :ref:`Docstrings <docstrings>`
- :ref:`Refactoring <refactoring>`

These topics are very important to understand what Jedi additionally does, but
they could be removed from Jedi and Jedi would still work. But slower and
without some features.

.. _iterables:

Iterables & Dynamic Arrays (inference/value/iterable.py)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

To understand Python on a deeper level, |jedi| needs to understand some of the
dynamic features of Python like lists that are filled after creation:

.. automodule:: jedi.inference.value.iterable


.. _dynamic:

Parameter completion (inference/dynamic.py)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. automodule:: jedi.inference.dynamic


.. _docstrings:

Docstrings (inference/docstrings.py)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. automodule:: jedi.inference.docstrings

.. _refactoring:

Refactoring (inference/refactoring.py)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. automodule:: jedi.refactoring


.. _imports-modules:

Imports & Modules
-------------------


- :ref:`Modules <modules>`
- :ref:`Builtin Modules <builtin>`
- :ref:`Imports <imports>`


.. _builtin:

Compiled Modules (inference/compiled.py)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. automodule:: jedi.inference.compiled


.. _imports:

Imports (inference/imports.py)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. automodule:: jedi.inference.imports


.. _caching-recursions:

Caching & Recursions
--------------------


- :ref:`Caching <cache>`
- :ref:`Recursions <recursion>`

.. _cache:

Caching (cache.py)
~~~~~~~~~~~~~~~~~~

.. automodule:: jedi.cache

.. _recursion:

Recursions (recursion.py)
~~~~~~~~~~~~~~~~~~~~~~~~~

.. automodule:: jedi.inference.recursion


.. _dev-helpers:

Helper Modules
---------------

Most other modules are not really central to how Jedi works. They all contain
relevant code, but you if you understand the modules above, you pretty much
understand Jedi.

Python 2/3 compatibility (_compatibility.py)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. automodule:: jedi._compatibility
