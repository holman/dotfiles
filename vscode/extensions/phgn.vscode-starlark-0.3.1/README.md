# Starlark extension for Visual Studio Code

Vscode extension that adds intelligent editor features for the [Starlark](https://github.com/bazelbuild/starlark) language.
<!-- including but not limited to Bazel and Buck files. -->

- Syntax highlighting

<img src=https://raw.githubusercontent.com/phgn0/vscode-starlark/master/images/syntax.gif width=734 height=255>

- Jump-to-definition and description for function calls

<img src=https://raw.githubusercontent.com/phgn0/vscode-starlark/master/images/funcdoc.gif width=734 height=255>

- Code autocomplete

<img src=https://raw.githubusercontent.com/phgn0/vscode-starlark/master/images/autocomplete.gif width=734 height=255>

- Linting through pylint

<img src=https://raw.githubusercontent.com/phgn0/vscode-starlark/master/images/linting.gif width=734 height=255>

## Background

[Starlark](https://github.com/bazelbuild/starlark) is becoming a dominant configuration language. Its great features include determinitic and isolated execution, as well as simplicity and great readbility.

While there is editor support for Bazel and Buck's build files, no existing editor extension provides jump-to-definition, linting and code completion for pure Starlark files, specifically its load() statement.

These issues will be solved in the future by Google's Starlark language server, [which is not open-source yet](https://github.com/bazelbuild/vscode-bazel/issues/1). This extension here exists to provide a good experience in the meantime.

## Architecture

Because Starlark's syntax is a subset of Python, we could of course try to use existing Python editor extensions - which is exactly what this project does.
It only takes a [tweak](https://github.com/phgn0/jedi/commit/1094ff2602525088f5a3a68c7f9381336f9b55e4) to the supported source file extensions, adjustment to the [Python grammar](https://github.com/phgn0/parso/commit/0374e508aedc1e144d43e77e12e006ad3faf0f45), [some](https://github.com/phgn0/parso/commit/a0fab9bcea7805326ac561ff1ad8eeecb2d064fc) [AST transformations](https://github.com/phgn0/pylint-starlark-plugin/blob/master/pylint_starlark_plugin/starlarkPlugin.py), [disabling python features](https://github.com/phgn0/vscode-starlark/commit/316f449da2585b2320f0dd531e193144974e45e6), [correct bundling](https://github.com/phgn0/vscode-starlark/commit/b9c5e734c5417c58efcaf9be23f951761f2a420b) of the modified libraries and [some](https://github.com/phgn0/vscode-starlark/commit/0f66198dbec295ab48e70939bb2cbb1f8a34d1a0) [debugging](https://github.com/phgn0/vscode-starlark/commit/20176a8ea3077f8a24b1cf54fb76db8116d348c6) ;)

Because most Python extension share the same code-intelligence library [jedi](https://github.com/phgn0/jedi), these modifications can be applied to other editors relatively easily.

## Future features

An editor extension based on Google's language server is the best long-term solution, so I don't plan on investing significant time into this project.
Though it may be interesting to add autocomplete for files in the load() statement, and we probably want to support [buildifier](https://github.com/bazelbuild/buildtools/tree/master/buildifier), Starlark's linting & code formatting tool.

Most importantly, please let me know if something doesn't work.
