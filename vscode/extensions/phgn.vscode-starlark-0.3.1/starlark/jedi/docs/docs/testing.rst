.. include:: ../global.rst

Jedi Testing
============

The test suite depends on ``tox`` and ``pytest``::

    pip install tox pytest

To run the tests for all supported Python versions::

    tox

If you want to test only a specific Python version (e.g. Python 2.7), it's as
easy as::

    tox -e py27

Tests are also run automatically on `Travis CI
<https://travis-ci.org/davidhalter/jedi/>`_.

You want to add a test for |jedi|? Great! We love that. Normally you should
write your tests as :ref:`Blackbox Tests <blackbox>`. Most tests would
fit right in there.

For specific API testing we're using simple unit tests, with a focus on a
simple and readable testing structure.

.. _blackbox:

Blackbox Tests (run.py)
~~~~~~~~~~~~~~~~~~~~~~~

.. automodule:: test.run

Refactoring Tests (refactor.py)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. automodule:: test.refactor

