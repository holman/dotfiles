.. include:: ../global.rst

Features and Caveats
====================

Jedi obviously supports autocompletion. It's also possible to get it working in
(:ref:`your REPL (IPython, etc.) <repl-completion>`).

Static analysis is also possible by using the command ``jedi.names``.

Jedi would in theory support refactoring, but we have never publicized it,
because it's not production ready. If you're interested in helping out here,
let me know. With the latest parser changes, it should be very easy to actually
make it work.


General Features
----------------

- Python 2.7 and 3.4+ support
- Ignores syntax errors and wrong indentation
- Can deal with complex module / function / class structures
- Great Virtualenv support
- Can infer function arguments from sphinx, epydoc and basic numpydoc docstrings,
  and PEP0484-style type hints (:ref:`type hinting <type-hinting>`)
- Stub files


Supported Python Features
-------------------------

|jedi| supports many of the widely used Python features:

- builtins
- returns, yields, yield from
- tuple assignments / array indexing / dictionary indexing / star unpacking
- with-statement / exception handling
- ``*args`` / ``**kwargs``
- decorators / lambdas / closures
- generators / iterators
- some descriptors: property / staticmethod / classmethod
- some magic methods: ``__call__``, ``__iter__``, ``__next__``, ``__get__``,
  ``__getitem__``, ``__init__``
- ``list.append()``, ``set.add()``, ``list.extend()``, etc.
- (nested) list comprehensions / ternary expressions
- relative imports
- ``getattr()`` / ``__getattr__`` / ``__getattribute__``
- function annotations
- class decorators (py3k feature, are being ignored too, until I find a use
  case, that doesn't work with |jedi|)
- simple/usual ``sys.path`` modifications
- ``isinstance`` checks for if/while/assert
- namespace packages (includes ``pkgutil``, ``pkg_resources`` and PEP420 namespaces)
- Django / Flask / Buildout support


Not Supported
-------------

Not yet implemented:

- manipulations of instances outside the instance variables without using
  methods

Will probably never be implemented:

- metaclasses (how could an auto-completion ever support this)
- ``setattr()``, ``__import__()``
- writing to some dicts: ``globals()``, ``locals()``, ``object.__dict__``


Caveats
-------

**Slow Performance**

Importing ``numpy`` can be quite slow sometimes, as well as loading the
builtins the first time. If you want to speed things up, you could write import
hooks in |jedi|, which preload stuff. However, once loaded, this is not a
problem anymore.  The same is true for huge modules like ``PySide``, ``wx``,
etc.

**Security**

Security is an important issue for |jedi|. Therefore no Python code is
executed.  As long as you write pure Python, everything is inferred
statically. But: If you use builtin modules (``c_builtin``) there is no other
option than to execute those modules. However: Execute isn't that critical (as
e.g. in pythoncomplete, which used to execute *every* import!), because it
means one import and no more.  So basically the only dangerous thing is using
the import itself. If your ``c_builtin`` uses some strange initializations, it
might be dangerous. But if it does you're screwed anyways, because eventually
you're going to execute your code, which executes the import.


Recipes
-------

Here are some tips on how to use |jedi| efficiently.


.. _type-hinting:

Type Hinting
~~~~~~~~~~~~

If |jedi| cannot detect the type of a function argument correctly (due to the
dynamic nature of Python), you can help it by hinting the type using
one of the following docstring/annotation syntax styles:

**PEP-0484 style**

https://www.python.org/dev/peps/pep-0484/

function annotations

::

    def myfunction(node: ProgramNode, foo: str) -> None:
        """Do something with a ``node``.

        """
        node.| # complete here


assignment, for-loop and with-statement type hints (all Python versions).
Note that the type hints must be on the same line as the statement

::

    x = foo()  # type: int
    x, y = 2, 3  # type: typing.Optional[int], typing.Union[int, str] # typing module is mostly supported
    for key, value in foo.items():  # type: str, Employee  # note that Employee must be in scope
        pass
    with foo() as f:  # type: int
        print(f + 3)

Most of the features in PEP-0484 are supported including the typing module
(for Python < 3.5 you have to do ``pip install typing`` to use these),
and forward references.

You can also use stub files.


**Sphinx style**

http://www.sphinx-doc.org/en/stable/domains.html#info-field-lists

::

    def myfunction(node, foo):
        """Do something with a ``node``.

        :type node: ProgramNode
        :param str foo: foo parameter description

        """
        node.| # complete here

**Epydoc**

http://epydoc.sourceforge.net/manual-fields.html

::

    def myfunction(node):
        """Do something with a ``node``.

        @type node: ProgramNode

        """
        node.| # complete here

**Numpydoc**

https://github.com/numpy/numpy/blob/master/doc/HOWTO_DOCUMENT.rst.txt

In order to support the numpydoc format, you need to install the `numpydoc
<https://pypi.python.org/pypi/numpydoc>`__ package.

::

    def foo(var1, var2, long_var_name='hi'):
        r"""A one-line summary that does not use variable names or the
        function name.

        ...

        Parameters
        ----------
        var1 : array_like
            Array_like means all those objects -- lists, nested lists,
            etc. -- that can be converted to an array. We can also
            refer to variables like `var1`.
        var2 : int
            The type above can either refer to an actual Python type
            (e.g. ``int``), or describe the type of the variable in more
            detail, e.g. ``(N,) ndarray`` or ``array_like``.
        long_variable_name : {'hi', 'ho'}, optional
            Choices in brackets, default first when optional.

        ...

        """
        var2.| # complete here

A little history
----------------

The Star Wars Jedi are awesome. My Jedi software tries to imitate a little bit
of the precognition the Jedi have. There's even an awesome `scene
<https://youtu.be/yHRJLIf7wMU>`_ of Monty Python Jedis :-).

But actually the name hasn't so much to do with Star Wars. It's part of my
second name.

After I explained Guido van Rossum, how some parts of my auto-completion work,
he said (we drank a beer or two):

    *"Oh, that worries me..."*

When it's finished, I hope he'll like it :-)

I actually started Jedi, because there were no good solutions available for VIM.
Most auto-completions just didn't work well. The only good solution was PyCharm.
But I like my good old VIM. Rope was never really intended to be an
auto-completion (and also I really hate project folders for my Python scripts).
It's more of a refactoring suite. So I decided to do my own version of a
completion, which would execute non-dangerous code. But I soon realized, that
this wouldn't work. So I built an extremely recursive thing which understands
many of Python's key features.

By the way, I really tried to program it as understandable as possible. But I
think understanding it might need quite some time, because of its recursive
nature.
