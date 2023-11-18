# Release notes

## v1.5.0

- Add support for Crystal https://crystal-lang.org (thanks @mathisto)
- Lower latency on remote workspaces (thanks @matthiaswenz)

## v1.4.2

- Fix behaviour in Normal mode when using the Vim plugin

## v1.4.1

- Fix indentation correction for newlines after brackets and braces (Issue [#14](https://github.com/kaiwood/vscode-endwise/issues/14))

## v1.4.0

- Allow additional typed space after blocks (Issue [#13](https://github.com/kaiwood/vscode-endwise/issues/13))

## v1.3.0

- Raise line limit to better handle huge Ruby files
- Default to **not** putting an "end" if this limit is reached

## v1.2.4

- Better regex for various Ruby related keywords

## v1.2.3

- Fix for users of the VSCodeVim extension, which added a new mode that colides with our overloaded `enter` key.

## v1.2.1

- Now takes the setting `editor.acceptSuggestionOnEnter` into account and gives it precedence for the overloaded `enter` key.

## v1.2.0

- Take single line definitions (`def foo; puts "bar"; end`) into account, credits to [@jittrfunc](https://github.com/jittrfunc) / [#3](https://github.com/kaiwood/vscode-endwise/pull/3)

## v1.1.1

- Keep indented cursor position on lines containing only whitespace

## v1.1.0

- Simplify unindentation

## v1.0.1

- Remove now unused dependency, add a proper changelog

## v1.0.0

- First non-prerelease version
