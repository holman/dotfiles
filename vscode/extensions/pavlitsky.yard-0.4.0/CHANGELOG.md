# Changelog

## [0.4.0] - 2020-03-23

- Add an configuration option for the `@param` tag to render name-before-type variant,
  i.e. `@param username [String]` ([#8](https://github.com/pavlitsky/vscode-yard/pull/8)).

## [0.3.2] - 2019-06-01

- Fix keyboard shortcut for Mac
- Document attributes accessors with `@return` tag instead of an `@!attribute` directive.
  ([@MicMicMon](https://github.com/MicMicMon))

## [0.3.1] - 2018-10-18

- Fix documenting methods which parameters aren't enclosed in parentheses. ([@pablox-cl](https://github.com/pablox-cl))

## [0.3.0] - 2018-04-08

- Add ability to document attributes accessors (`attr_reader`, `attr_writer`,
  `attr_accessor` and more).

## [0.2.2] - 2018-04-05

- Update README with more examples.

## [0.2.1] - 2018-04-03

- Improve method name detection. Added operators (like `def >>; end`)
 and Japanese symbols detection.
- Fix detection of methods ending with `!?=`.

## [0.2.0] - 2018-04-03

- Add configuration options.

## [0.1.0] - 2018-03-27

- Initial release.
