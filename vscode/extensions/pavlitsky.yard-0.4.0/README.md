# YARD Documenter

[![Build Status](https://travis-ci.org/pavlitsky/vscode-yard.svg?branch=master)](https://travis-ci.org/pavlitsky/vscode-yard)
[![Maintainability](https://api.codeclimate.com/v1/badges/54361b514cbeb2dd279c/maintainability)](https://codeclimate.com/github/pavlitsky/vscode-yard/maintainability)

Extension generates [YARD](https://yardoc.org/) documentation comments for Ruby
source code.

See [Readme](http://www.rubydoc.info/gems/yard/file/README.md) for more
information on this tool.

## Features

Extension automatically prepends definitions of methods, classes etc with
documentation snippets.
No need to remember a formatting tags and styling, just type and describe your code.

It's able to document:

* Methods: instance methods, initializers, class methods.
* Classes and Modules.
* Constants.
* Attributes accessors (`attr_reader`, `attr_writer`, `attr_accessor` and more).

Methods named in ASCII and Japanese are supported.

## Usage

Position cursor on a definition you wish to document.

```ruby
def foo(bar, baz = false) # <- put cursor at any place of this line
end
```

Hit `Ctrl+Alt+Enter` (`Option+Command+Enter` on macOS) or invoke `Document with YARD`
from the command palette.

```ruby
  #
  # <Description>
  #
  # @param [<Type>] bar <description>
  # @param [<Type>] baz <description>
  #
  # @return [<Type>] <description>
  #
  def foo(bar, baz = false)
  end
```

Documentation snippet appears on top of the method.

Use `Tab` and `Shift+Tab` keys to navigate and fill in placeholders.

```ruby
  #
  # An example instance method description.
  #
  # @param [Integer] bar first param used for demonstration
  # @param [Boolean] baz second param with a default value
  #
  # @return [nil] nothing returned so it's always nil
  #
  def foo(bar, baz = false)
  end
```

Done!

Another snippets examples, default spacers setup:

```ruby
#
# Class to retry and fail.
#
# @author Author Name <author@example.com>
#
class Foo
  # @return [Integer] count of retries performed before failing
  RETRIES_COUNT=3

  # @return [Boolean] retry operation result
  attr_accessor :succeed

  #
  # Retry something.
  #
  # @return [Boolean] processing result, true if succeed
  #
  def retry
    RETRIES_COUNT.times { puts 'Retrying...' }
    @succeed = false
  end
end
```

Minimal setup:

```ruby
# Class to retry and fail.
class Foo
  # @return [Integer] count of retries performed before failing
  RETRIES_COUNT=3

  # @return [Boolean] retry operation result
  attr_accessor :succeed

  # Retry something.
  # @return [Boolean] processing result, true if succeed
  def retry
    RETRIES_COUNT.times { puts 'Retrying...' }
    @succeed = false
  end
end
```

Feel free to append any needed tags like `@note`, `@example`, `@see` manually
after snippet filled in.

## Details

List of generated tags: `@author`, `@option`, `@param`, `@return`.

## Configuration

Insertion of empty lines are configurable to make it able to tune between
a curt and verbose documentation styles.

```ts
"yard.spacers.beforeDescription" // Prepend an empty line to descriptive texts
"yard.spacers.afterDescription" // Append an empty line to descriptive texts
"yard.spacers.beforeTags" // Prepend an empty line to all method's tags
"yard.spacers.separateTags" // Separate method's tags of the same name (@params and @return) with an empty line
"yard.spacers.afterTags" // Append an empty line to all method's tags
"yard.spacers.beforeSingleTag" // Prepend an empty line to directives or single tags (for example constants)
"yard.spacers.afterSingleTag" // Append an empty line to directives or single tags (for example constants)
"yard.tags.author" // Append @author tag to Class and Module documentation
"yard.tags.paramNameBeforeType" // Print param name before its type (for example '@param username [String]')
```

## TODO

* Ability to document blocks: `@yield`, `@yieldparam`, `@yieldreturn`.
* Support for non-empty options hash parameters.
* Resolve `@author` information from environment or settings.
* (killer feature :fire:) Ability to update existing documentation.
* (maybe) Editor snippets for tags (`@option`, `@param` etc) or tags autocompletion
* (maybe) A better support for array / keyword args splats, see
  [comment](https://github.com/lsegal/yard/issues/439#issuecomment-3292412).

## Troubleshooting

If hotkey isn't working open VS Code Keyboard Shortcuts and check for keybinging
conflicts.

This also may happen if destination is already documented. In this case extension
silently does nothing.
