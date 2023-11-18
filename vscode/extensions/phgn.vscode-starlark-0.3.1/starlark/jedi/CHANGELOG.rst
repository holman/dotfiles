.. :changelog:

Changelog
---------

0.15.1 (2019-08-13)
+++++++++++++++++++

- Small bugfix and removal of a print statement

0.15.0 (2019-08-11)
+++++++++++++++++++

- Added file path completions, there's a **new** ``Completion.type`` now:
  ``path``. Example: ``'/ho`` -> ``'/home/``
- ``*args``/``**kwargs`` resolving. If possible Jedi replaces the parameters
  with the actual alternatives.
- Better support for enums/dataclasses
- When using Interpreter, properties are now executed, since a lot of people
  have complained about this. Discussion in #1299, #1347.

New APIs:

- ``Definition.get_signatures() -> List[Signature]``. Signatures are similar to
  ``CallSignature``. ``Definition.params`` is therefore deprecated.
- ``Signature.to_string()`` to format call signatures.
- ``Signature.params -> List[ParamDefinition]``, ParamDefinition has the
  following additional attributes ``infer_default()``, ``infer_annotation()``,
  ``to_string()``, and ``kind``.
- ``Definition.execute() -> List[Definition]``, makes it possible to infer
  return values of functions.


0.14.1 (2019-07-13)
+++++++++++++++++++

- CallSignature.index should now be working a lot better
- A couple of smaller bugfixes

0.14.0 (2019-06-20)
+++++++++++++++++++

- Added ``goto_*(prefer_stubs=True)`` as well as ``goto_*(prefer_stubs=True)``
- Stubs are used now for type inference
- Typeshed is used for better type inference
- Reworked Definition.full_name, should have more correct return values

0.13.3 (2019-02-24)
+++++++++++++++++++

- Fixed an issue with embedded Python, see https://github.com/davidhalter/jedi-vim/issues/870

0.13.2 (2018-12-15)
+++++++++++++++++++

- Fixed a bug that led to Jedi spawning a lot of subprocesses.

0.13.1 (2018-10-02)
+++++++++++++++++++

- Bugfixes, because tensorflow completions were still slow.

0.13.0 (2018-10-02)
+++++++++++++++++++

- A small release. Some bug fixes.
- Remove Python 3.3 support. Python 3.3 support has been dropped by the Python
  foundation.
- Default environments are now using the same Python version as the Python
  process. In 0.12.x, we used to load the latest Python version on the system.
- Added ``include_builtins`` as a parameter to usages.
- ``goto_assignments`` has a new ``follow_builtin_imports`` parameter that
  changes the previous behavior slightly.

0.12.1 (2018-06-30)
+++++++++++++++++++

- This release forces you to upgrade parso. If you don't, nothing will work
  anymore. Otherwise changes should be limited to bug fixes. Unfortunately Jedi
  still uses a few internals of parso that make it hard to keep compatibility
  over multiple releases. Parso >=0.3.0 is going to be needed.

0.12.0 (2018-04-15)
+++++++++++++++++++

- Virtualenv/Environment support
- F-String Completion/Goto Support
- Cannot crash with segfaults anymore
- Cleaned up import logic
- Understand async/await and autocomplete it (including async generators)
- Better namespace completions
- Passing tests for Windows (including CI for Windows)
- Remove Python 2.6 support

0.11.1 (2017-12-14)
+++++++++++++++++++

- Parso update - the caching layer was broken
- Better usages - a lot of internal code was ripped out and improved.

0.11.0 (2017-09-20)
+++++++++++++++++++

- Split Jedi's parser into a separate project called ``parso``.
- Avoiding side effects in REPL completion.
- Numpy docstring support should be much better.
- Moved the `settings.*recursion*` away, they are no longer usable.

0.10.2 (2017-04-05)
+++++++++++++++++++

- Python Packaging sucks. Some files were not included in 0.10.1.

0.10.1 (2017-04-05)
+++++++++++++++++++

- Fixed a few very annoying bugs.
- Prepared the parser to be factored out of Jedi.

0.10.0 (2017-02-03)
+++++++++++++++++++

- Actual semantic completions for the complete Python syntax.
- Basic type inference for ``yield from`` PEP 380.
- PEP 484 support (most of the important features of it). Thanks Claude! (@reinhrst)
- Added ``get_line_code`` to ``Definition`` and ``Completion`` objects.
- Completely rewritten the type inference engine.
- A new and better parser for (fast) parsing diffs of Python code.

0.9.0 (2015-04-10)
++++++++++++++++++

- The import logic has been rewritten to look more like Python's. There is now
  an ``InferState.modules`` import cache, which resembles ``sys.modules``.
- Integrated the parser of 2to3. This will make refactoring possible. It will
  also be possible to check for error messages (like compiling an AST would give)
  in the future.
- With the new parser, the type inference also completely changed. It's now
  simpler and more readable.
- Completely rewritten REPL completion.
- Added ``jedi.names``, a command to do static analysis. Thanks to that
  sourcegraph guys for sponsoring this!
- Alpha version of the linter.


0.8.1 (2014-07-23)
+++++++++++++++++++

- Bugfix release, the last release forgot to include files that improve
  autocompletion for builtin libraries. Fixed.

0.8.0 (2014-05-05)
+++++++++++++++++++

- Memory Consumption for compiled modules (e.g. builtins, sys) has been reduced
  drastically. Loading times are down as well (it takes basically as long as an
  import).
- REPL completion is starting to become usable.
- Various small API changes. Generally this release focuses on stability and
  refactoring of internal APIs.
- Introducing operator precedence, which makes calculating correct Array
  indices and ``__getattr__`` strings possible.

0.7.0 (2013-08-09)
++++++++++++++++++

- Switched from LGPL to MIT license.
- Added an Interpreter class to the API to make autocompletion in REPL
  possible.
- Added autocompletion support for namespace packages.
- Add sith.py, a new random testing method.

0.6.0 (2013-05-14)
++++++++++++++++++

- Much faster parser with builtin part caching.
- A test suite, thanks @tkf.

0.5 versions (2012)
+++++++++++++++++++

- Initial development.
