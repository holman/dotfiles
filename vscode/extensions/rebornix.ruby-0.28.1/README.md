# Ruby for Visual Studio Code

[![CircleCI](https://img.shields.io/circleci/build/github/rubyide/vscode-ruby?label=circleci&token=c9eaf03305b3fe24e8bc819f3f48060431e8e78f)](https://circleci.com/gh/rubyide/vscode-ruby)
[![Build status](https://ci.appveyor.com/api/projects/status/vlgs2y7tsc4xpj4c?svg=true)](https://ci.appveyor.com/project/rebornix/vscode-ruby)
[![codecov](https://codecov.io/gh/rubyide/vscode-ruby/branch/master/graph/badge.svg)](https://codecov.io/gh/rubyide/vscode-ruby)

This extension provides enhanced Ruby language and debugging support for Visual Studio Code.

## Features

- Automatic Ruby environment detection with support for rvm, rbenv, chruby, and asdf
- Lint support via RuboCop, Standard, and Reek
- Format support via RuboCop, Standard, Rufo, Prettier and RubyFMT
- Semantic code folding support
- Semantic highlighting support
- Basic Intellisense support

## Installation

Search for `ruby` in the [VS Code Extension Gallery](https://code.visualstudio.com/docs/editor/extension-gallery) and install it!

## Initial Configuration

By default, the extension provides sensible defaults for developers to get a better experience using Ruby in Visual Studio Code. However, these defaults do not include settings to enable features like formatting or linting. Given how dynamic Ruby projects can be (are you using rvm, rbenv, chruby, or asdf? Are your gems globally installed or via bundler? etc), the extension requires additional configuration for additional features to be available.

### Using the Language Server

It is **highly recommended** that you enable the Ruby language server (via the Use Language Server setting or `ruby.useLanguageServer` config option). The server does not default to enabled while it is under development but it provides a significantly better experience than the legacy extension functionality. See [docs/language-server.md](https://github.com/rubyide/vscode-ruby/blob/master/docs/language-server.md) for more information on the language server.

Legacy functionality will most likely not receive additional improvements and will be fully removed when the extension hits v1.0

### Example Initial Configuration:

```json
"ruby.useBundler": true, //run non-lint commands with bundle exec
"ruby.useLanguageServer": true, // use the internal language server (see below)
"ruby.lint": {
  "rubocop": {
    "useBundler": true // enable rubocop via bundler
  },
  "reek": {
    "useBundler": true // enable reek via bundler
  }
},
"ruby.format": "rubocop" // use rubocop for formatting
```

Reviewing the [linting](https://github.com/rubyide/vscode-ruby/blob/master/docs/linting.md), [formatting](https://github.com/rubyide/vscode-ruby/blob/master/docs/formatting.md), and [environment detection](https://github.com/rubyide/vscode-ruby/blob/master/docs/language-server.md) docs is recommended

For full details on configuration options, please take a look at the `Ruby` section in the VS Code settings UI. Each option is associated with a name and description.

### Debug Configuration

See [docs/debugger.md](https://github.com/rubyide/vscode-ruby/blob/master/docs/debugger.md).

### Legacy Configuration

[docs/legacy.md](https://github.com/rubyide/vscode-ruby/blob/master/docs/legacy.md) contains the documentation around the legacy functionality

## Troubleshooting

See [docs/troubleshooting.md](https://github.com/rubyide/vscode-ruby/blob/master/docs/troubleshooting.md)

## Other Notable Extensions

- [Ruby Solargraph](https://marketplace.visualstudio.com/items?itemName=castwide.solargraph) - Solargraph is a language server that provides intellisense, code completion, and inline documentation for Ruby.
- [VSCode Endwise](https://github.com/kaiwood/vscode-endwise) - Wisely add "end" in Ruby
