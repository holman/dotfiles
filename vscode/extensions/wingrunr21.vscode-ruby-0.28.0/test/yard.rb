# SYNTAX TEST "source.ruby"
  # @author Full Name
# ^ punctuation.definition.comment.ruby
#   ^ comment.line.keyword.punctuation.yard.ruby
#    ^^^^^^ comment.line.keyword.yard.ruby
#          ^^^^^^^^^^^ comment.line.number-sign.ruby comment.line.string.yard.ruby
  # @abstract
# ^ punctuation.definition.comment.ruby
#   ^ comment.line.keyword.punctuation.yard.ruby
#    ^^^^^^^^ comment.line.keyword.yard.ruby
  # @since 0.6.0
# ^ punctuation.definition.comment.ruby
#   ^ comment.line.keyword.punctuation.yard.ruby
#    ^^^^^ comment.line.keyword.yard.ruby
#         ^^^^^^^ comment.line.number-sign.ruby comment.line.string.yard.ruby
  # @api private
  # @attr attribute_name [Types] a full description of the attribute
# ^ punctuation.definition.comment.ruby
#   ^ comment.line.keyword.punctuation.yard.ruby
#    ^^^^ comment.line.keyword.yard.ruby
#         ^^^^^^^^^^^^^^ comment.line.parameter.yard.ruby
#                        ^ comment.line.type.yard.ruby comment.line.punctuation.yard.ruby
#                         ^^^^^ comment.line.type.yard.ruby
#                              ^ comment.line.type.yard.ruby comment.line.punctuation.yard.ruby
#                               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ comment.line.number-sign.ruby comment.line.string.yard.ruby
  # @attr [Types] attribute_name a full description of the attribute
#         ^ comment.line.type.yard.ruby comment.line.punctuation.yard.ruby
#          ^^^^^ comment.line.type.yard.ruby
#               ^ comment.line.type.yard.ruby comment.line.punctuation.yard.ruby
#                 ^^^^^^^^^^^^^^ comment.line.parameter.yard.ruby
#                               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ comment.line.number-sign.ruby comment.line.string.yard.ruby
  # @attr_reader name [Types] description of a readonly attribute
# ^ punctuation.definition.comment.ruby
#   ^ comment.line.keyword.punctuation.yard.ruby
#    ^^^^^^^^^^^ comment.line.keyword.yard.ruby
#                ^^^^ comment.line.parameter.yard.ruby
#                     ^ comment.line.type.yard.ruby comment.line.punctuation.yard.ruby
#                      ^^^^^ comment.line.type.yard.ruby
#                           ^ comment.line.type.yard.ruby comment.line.punctuation.yard.ruby
#                            ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ comment.line.number-sign.ruby comment.line.string.yard.ruby
  # @attr_reader [Types] name description of a readonly attribute
#                ^ comment.line.type.yard.ruby comment.line.punctuation.yard.ruby
#                 ^^^^^ comment.line.type.yard.ruby
#                      ^ comment.line.type.yard.ruby comment.line.punctuation.yard.ruby
#                        ^^^^ comment.line.parameter.yard.ruby
#                            ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ comment.line.number-sign.ruby comment.line.string.yard.ruby

  # @attr_writer name [Types] description of writeonly attribute
# ^ punctuation.definition.comment.ruby
#   ^ comment.line.keyword.punctuation.yard.ruby
#    ^^^^^^^^^^^ comment.line.keyword.yard.ruby
#                ^^^^ comment.line.parameter.yard.ruby
#                     ^ comment.line.type.yard.ruby comment.line.punctuation.yard.ruby
#                      ^^^^^ comment.line.type.yard.ruby
#                           ^ comment.line.type.yard.ruby comment.line.punctuation.yard.ruby
#                            ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ comment.line.number-sign.ruby comment.line.string.yard.ruby

  # @attr_writer [Types] name description of writeonly attribute
#                ^ comment.line.type.yard.ruby comment.line.punctuation.yard.ruby
#                 ^^^^^ comment.line.type.yard.ruby
#                      ^ comment.line.type.yard.ruby comment.line.punctuation.yard.ruby
#                        ^^^^ comment.line.parameter.yard.ruby
  #
  # @see http://example.com Description of URL
# ^ punctuation.definition.comment.ruby
#   ^ comment.line.keyword.punctuation.yard.ruby
#    ^^^ comment.line.keyword.yard.ruby
#        ^^^^^^^^^^^^^^^^^^ comment.line.parameter.yard.ruby
#                          ^^^^^^^^^^^^^^^^^^^^ comment.line.number-sign.ruby comment.line.string.yard.ruby
  # @see SomeOtherClass#method
# ^ punctuation.definition.comment.ruby
#   ^ comment.line.keyword.punctuation.yard.ruby
#    ^^^ comment.line.keyword.yard.ruby
#        ^^^^^^^^^^^^^^^^^^^^^ comment.line.parameter.yard.ruby
  #
  # @deprecated Use {#my_new_method} instead of this method because
# ^ punctuation.definition.comment.ruby
#   ^ comment.line.keyword.punctuation.yard.ruby
#    ^^^^^^^^^^ comment.line.keyword.yard.ruby
#              ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ comment.line.number-sign.ruby comment.line.string.yard.ruby
  #   it uses a library that is no longer supported in Ruby 1.9. 
#  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ comment.line.number-sign.ruby comment.line.string.yard.ruby
  #   The new method accepts the same parameters.
#  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ comment.line.number-sign.ruby comment.line.string.yard.ruby
  #
  # @abstract
# ^ punctuation.definition.comment.ruby
#   ^ comment.line.keyword.punctuation.yard.ruby
#    ^^^^^^^^ comment.line.keyword.yard.ruby
  # @private
# ^ punctuation.definition.comment.ruby
#   ^ comment.line.keyword.punctuation.yard.ruby
#    ^^^^^^^ comment.line.keyword.yard.ruby
  #
  # @param opts [Hash] the options to create a message with.
  # @option opts [String] :subject! The subject
# ^ punctuation.definition.comment.ruby
#   ^ comment.line.keyword.punctuation.yard.ruby
#    ^^^^^^ comment.line.keyword.yard.ruby
#           ^^^^ comment.line.parameter.yard.ruby
#                ^ comment.line.type.yard.ruby comment.line.punctuation.yard.ruby
#                 ^^^^^^ comment.line.type.yard.ruby
#                       ^ comment.line.type.yard.ruby comment.line.punctuation.yard.ruby
#                         ^^^^^^^^^ comment.line.keyword.yard.ruby comment.line.hashkey.yard.ruby
#                                  ^^^^^^^^^^^^^ comment.line.number-sign.ruby comment.line.string.yard.ruby
  # @option opts [String] :from? ('nobody') From address
# ^ punctuation.definition.comment.ruby
#   ^ comment.line.keyword.punctuation.yard.ruby
#    ^^^^^^ comment.line.keyword.yard.ruby
#           ^^^^ comment.line.parameter.yard.ruby
#                ^ comment.line.type.yard.ruby comment.line.punctuation.yard.ruby
#                 ^^^^^^ comment.line.type.yard.ruby
#                       ^ comment.line.type.yard.ruby comment.line.punctuation.yard.ruby
#                         ^^^^^^ comment.line.keyword.yard.ruby comment.line.hashkey.yard.ruby
#                                ^ comment.line.defaultvalue.yard.ruby comment.line.punctuation.yard.ruby
#                                 ^^^^^^^^ comment.line.defaultvalue.yard.ruby
#                                         ^ comment.line.defaultvalue.yard.ruby comment.line.punctuation.yard.ruby
#                                          ^^^^^^^^^^^^^^ comment.line.number-sign.ruby comment.line.string.yard.ruby

  # @option opts [String] :to_ Recipient email
  # @option opts [String] :body ('') The email's body
  # @option opts1 [String] :sha256 ('') The email's body
# ^ punctuation.definition.comment.ruby
#   ^ comment.line.keyword.punctuation.yard.ruby
#    ^^^^^^ comment.line.keyword.yard.ruby
#           ^^^^^ comment.line.parameter.yard.ruby
#                 ^ comment.line.type.yard.ruby comment.line.punctuation.yard.ruby
#                  ^^^^^^ comment.line.type.yard.ruby
#                        ^ comment.line.type.yard.ruby comment.line.punctuation.yard.ruby
#                          ^^^^^^^ comment.line.keyword.yard.ruby comment.line.hashkey.yard.ruby
#                                  ^ comment.line.defaultvalue.yard.ruby comment.line.punctuation.yard.ruby
#                                   ^^ comment.line.defaultvalue.yard.ruby
#                                     ^ comment.line.defaultvalue.yard.ruby comment.line.punctuation.yard.ruby
#                                      ^^^^^^^^^^^^^^^^^^ comment.line.number-sign.ruby comment.line.string.yard.ruby
  #
  # @param (see User#initialize)
# ^ punctuation.definition.comment.ruby
#   ^ comment.line.keyword.punctuation.yard.ruby
#    ^^^^^ comment.line.keyword.yard.ruby
#         ^^^^^^^^^^^^^^^^^^^^^^^ comment.line.number-sign.ruby comment.line.string.yard.ruby
  # @param opts [OptionParser] the option parser object
# ^ punctuation.definition.comment.ruby
#   ^ comment.line.keyword.punctuation.yard.ruby
#    ^^^^^ comment.line.keyword.yard.ruby
#          ^^^^ comment.line.parameter.yard.ruby
#               ^ comment.line.type.yard.ruby comment.line.punctuation.yard.ruby
#                ^^^^^^^^^^^^ comment.line.type.yard.ruby
#                            ^ comment.line.type.yard.ruby comment.line.punctuation.yard.ruby
#                             ^^^^^^^^^^^^^^^^^^^^^^^^^^ comment.line.number-sign.ruby comment.line.string.yard.ruby
  # @param [OptionParser] opts the option parser object
# ^ punctuation.definition.comment.ruby
#   ^ comment.line.keyword.punctuation.yard.ruby
#    ^^^^^ comment.line.keyword.yard.ruby
#          ^ comment.line.type.yard.ruby comment.line.punctuation.yard.ruby
#           ^^^^^^^^^^^^ comment.line.type.yard.ruby
#                       ^ comment.line.type.yard.ruby comment.line.punctuation.yard.ruby
#                         ^^^^ comment.line.parameter.yard.ruby
#                             ^^^^^^^^^^^^^^^^^^^^^^^^^^ comment.line.number-sign.ruby comment.line.string.yard.ruby
  # @param args [Array<String>] the arguments passed from input. This
  #   array will be modified.
#  ^^^^^^^^^^^^^^^^^^^^^^^^^^^ comment.line.number-sign.ruby comment.line.string.yard.ruby

  # @param list [Array<String, Symbol>] the list of strings and symbols.
  #
  # @example Reverse a string
# ^ punctuation.definition.comment.ruby
#   ^ comment.line.keyword.punctuation.yard.ruby
#    ^^^^^^^ comment.line.keyword.yard.ruby
#           ^^^^^^^^^^^^^^^^^^ comment.line.number-sign.ruby comment.line.string.yard.ruby
  #   "mystring.reverse" #=> "gnirtsym"
#  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ comment.line.number-sign.ruby comment.line.string.yard.ruby
  #
  #   multiline with empty line wihout spaces
#  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ comment.line.number-sign.ruby comment.line.string.yard.ruby
  #
  # @example Parse a glob of files
# ^ punctuation.definition.comment.ruby
#   ^ comment.line.keyword.punctuation.yard.ruby
#    ^^^^^^^ comment.line.keyword.yard.ruby
#           ^^^^^^^^^^^^^^^^^^^^^^^ comment.line.number-sign.ruby comment.line.string.yard.ruby
  #   YARD.parse('lib/**/*.rb')
#  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ comment.line.number-sign.ruby comment.line.string.yard.ruby
  #
  # @note This method may modify our application state!
# ^ punctuation.definition.comment.ruby
#   ^ comment.line.keyword.punctuation.yard.ruby
#    ^^^^ comment.line.keyword.yard.ruby

  #  
  # @raise [ExceptionClass] description
# ^ punctuation.definition.comment.ruby
#   ^ comment.line.keyword.punctuation.yard.ruby
#    ^^^^^ comment.line.keyword.yard.ruby
#          ^ comment.line.type.yard.ruby comment.line.punctuation.yard.ruby
#           ^^^^^^^^^^^^^^ comment.line.type.yard.ruby
#                         ^ comment.line.type.yard.ruby comment.line.punctuation.yard.ruby
#                          ^^^^^^^^^^^^^ comment.line.number-sign.ruby comment.line.string.yard.ruby
  #
  # @return [optional, types, ...] description
# ^ punctuation.definition.comment.ruby
#   ^ comment.line.keyword.punctuation.yard.ruby
#    ^^^^^^ comment.line.keyword.yard.ruby
#           ^ comment.line.type.yard.ruby comment.line.punctuation.yard.ruby
#            ^^^^^^^^^^^^^^^^^^^^ comment.line.type.yard.ruby
#                                ^ comment.line.type.yard.ruby comment.line.punctuation.yard.ruby
#                                 ^^^^^^^^^^^^^ comment.line.number-sign.ruby comment.line.string.yard.ruby
  # @return [true] always returns true
  # @return [void]
  # @return [String, nil] the contents of our object o# @api private
  # @return the object
# ^ punctuation.definition.comment.ruby
#   ^ comment.line.keyword.punctuation.yard.ruby
#    ^^^^^^ comment.line.keyword.yard.ruby
#          ^^^^^^^^^^^^ comment.line.number-sign.ruby comment.line.string.yard.ruby
  #
  # @todo Add support for Jabberwocky service
# ^ punctuation.definition.comment.ruby
#   ^ comment.line.keyword.punctuation.yard.ruby
#    ^^^^ comment.line.keyword.yard.ruby
#        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ comment.line.number-sign.ruby comment.line.string.yard.ruby
  #   There is an open source Jabberwocky library available 
  #   at http://somesite.com that can be integrated easily
  #   into the project.
  #
  # for block {|a, b, c| ... }
  # @yield [a, b, c] Description of block
# ^ punctuation.definition.comment.ruby
#   ^ comment.line.keyword.punctuation.yard.ruby
#    ^^^^^ comment.line.keyword.yard.ruby
#          ^ comment.line.type.yard.ruby comment.line.punctuation.yard.ruby
#           ^^^^^^^ comment.line.type.yard.ruby
#                  ^ comment.line.type.yard.ruby comment.line.punctuation.yard.ruby
#                   ^^^^^^^^^^^^^^^^^^^^^^ comment.line.number-sign.ruby comment.line.string.yard.ruby
  # @yieldparam name [String] the name that is yielded
# ^ punctuation.definition.comment.ruby
#   ^ comment.line.keyword.punctuation.yard.ruby
#    ^^^^^^^^^^ comment.line.keyword.yard.ruby
#               ^^^^ comment.line.parameter.yard.ruby
#                    ^ comment.line.type.yard.ruby comment.line.punctuation.yard.ruby
#                     ^^^^^^ comment.line.type.yard.ruby
#                           ^ comment.line.type.yard.ruby comment.line.punctuation.yard.ruby
#                            ^^^^^^^^^^^^^^^^^^^^^^^^^^ comment.line.number-sign.ruby comment.line.string.yard.ruby
  # @yieldparam [String] name the name that is yielded
# ^ punctuation.definition.comment.ruby
#   ^ comment.line.keyword.punctuation.yard.ruby
#    ^^^^^^^^^^ comment.line.keyword.yard.ruby
#               ^ comment.line.type.yard.ruby comment.line.punctuation.yard.ruby
#                ^^^^^^ comment.line.type.yard.ruby
#                      ^ comment.line.type.yard.ruby comment.line.punctuation.yard.ruby
#                        ^^^^ comment.line.parameter.yard.ruby
#                            ^^^^^^^^^^^^^^^^^^^^^^^^^^ comment.line.number-sign.ruby comment.line.string.yard.ruby
  # @yieldreturn [Fixnum] the number to add 5 to.
# ^ punctuation.definition.comment.ruby
#   ^ comment.line.keyword.punctuation.yard.ruby
#    ^^^^^^^^^^^ comment.line.keyword.yard.ruby
#                ^ comment.line.type.yard.ruby comment.line.punctuation.yard.ruby
#                 ^^^^^^ comment.line.type.yard.ruby
#                       ^ comment.line.type.yard.ruby comment.line.punctuation.yard.ruby
#                        ^^^^^^^^^^^^^^^^^^^^^^^^^ comment.line.number-sign.ruby comment.line.string.yard.ruby
  #
  # @overload set(key, value)
# ^ punctuation.definition.comment.ruby
#   ^ comment.line.keyword.punctuation.yard.ruby
#    ^^^^^^^^ comment.line.keyword.yard.ruby
#            ^^^^^^^^^^^^^^^^^ comment.line.number-sign.ruby comment.line.string.yard.ruby
  #   Sets a value on key
  #   @param key [Symbol] describe key param
#     ^ comment.line.keyword.punctuation.yard.ruby
#      ^^^^^ comment.line.keyword.yard.ruby
#            ^^^ comment.line.parameter.yard.ruby
#                ^ comment.line.type.yard.ruby comment.line.punctuation.yard.ruby
#                 ^^^^^^ comment.line.type.yard.ruby
#                       ^ comment.line.type.yard.ruby comment.line.punctuation.yard.ruby
#                        ^^^^^^^^^^^^^^^^^^^^ comment.line.number-sign.ruby comment.line.string.yard.ruby comment.line.number-sign.ruby comment.line.string.yard.ruby
  #   @param [Object] value describe value param
#     ^ comment.line.keyword.punctuation.yard.ruby
#      ^^^^^ comment.line.keyword.yard.ruby
#            ^ comment.line.type.yard.ruby comment.line.punctuation.yard.ruby
#             ^^^^^^ comment.line.type.yard.ruby
#                   ^ comment.line.type.yard.ruby comment.line.punctuation.yard.ruby
#                     ^^^^^ comment.line.parameter.yard.ruby
#                          ^^^^^^^^^^^^^^^^^^^^^^ comment.line.number-sign.ruby comment.line.string.yard.ruby comment.line.number-sign.ruby comment.line.string.yard.ruby
  # @overload set(value)
#   ^ comment.line.keyword.punctuation.yard.ruby
#    ^^^^^^^^ comment.line.keyword.yard.ruby
#            ^^^^^^^^^^^^ comment.line.number-sign.ruby comment.line.string.yard.ruby
  #   Sets a value on the default key +:foo+
  #   @param value [Object] describe value param
#     ^ comment.line.keyword.punctuation.yard.ruby
#      ^^^^^ comment.line.keyword.yard.ruby
#            ^^^^^ comment.line.parameter.yard.ruby
#                  ^ comment.line.type.yard.ruby comment.line.punctuation.yard.ruby
#                   ^^^^^^ comment.line.type.yard.ruby
#                         ^ comment.line.type.yard.ruby comment.line.punctuation.yard.ruby
#                          ^^^^^^^^^^^^^^^^^^^^^^ comment.line.number-sign.ruby comment.line.string.yard.ruby comment.line.number-sign.ruby comment.line.string.yard.ruby
  #
  # @version 2.0
# ^ punctuation.definition.comment.ruby
#   ^ comment.line.keyword.punctuation.yard.ruby
#    ^^^^^^^ comment.line.keyword.yard.ruby
#           ^^^^^ comment.line.number-sign.ruby comment.line.string.yard.ruby
  #
  # Simple readonly attribute
  # @!attribute [r] count
#   ^^ comment.line.keyword.punctuation.yard.ruby
#     ^^^^^^^^^ comment.line.keyword.yard.ruby
#               ^ comment.line.type.yard.ruby comment.line.punctuation.yard.ruby
#                ^ comment.line.type.yard.ruby
#                 ^ comment.line.type.yard.ruby comment.line.punctuation.yard.ruby
#                   ^^^^^ comment.line.number-sign.ruby comment.line.parameter.yard.ruby
  #   @return [Fixnum] the size of the list
#     ^ comment.line.keyword.punctuation.yard.ruby
#      ^^^^^^ comment.line.keyword.yard.ruby
#             ^ comment.line.type.yard.ruby comment.line.punctuation.yard.ruby
#              ^^^^^^ comment.line.type.yard.ruby
#                    ^ comment.line.type.yard.ruby comment.line.punctuation.yard.ruby
#                     ^^^^^^^^^^^^^^^^^^^^^^ comment.line.number-sign.ruby comment.line.string.yard.ruby comment.line.number-sign.ruby comment.line.string.yard.ruby
  #
  # Simple writeonly attribute
  # @!attribute [w] last_name
  #   @return [Fixnum] the last_name of the user
  #
  # Simple readwrite attribute
  # @!attribute name
#   ^^ comment.line.keyword.punctuation.yard.ruby
#     ^^^^^^^^^ comment.line.keyword.yard.ruby
#               ^^^^ comment.line.number-sign.ruby comment.line.parameter.yard.ruby
  #   @return [String] the name of the user
# ^ punctuation.definition.comment.ruby
#     ^ comment.line.keyword.punctuation.yard.ruby
#      ^^^^^^ comment.line.keyword.yard.ruby
#             ^ comment.line.type.yard.ruby comment.line.punctuation.yard.ruby
#              ^^^^^^ comment.line.type.yard.ruby
#                    ^ comment.line.type.yard.ruby comment.line.punctuation.yard.ruby
#                     ^^^^^^^^^^^^^^^^^^^^^^ comment.line.number-sign.ruby comment.line.string.yard.ruby comment.line.number-sign.ruby comment.line.string.yard.ruby
  #
  # @!group Callbacks
#   ^^ comment.line.keyword.punctuation.yard.ruby
#     ^^^^^ comment.line.keyword.yard.ruby
#          ^^^^^^^^^^^ comment.line.number-sign.ruby comment.line.string.yard.ruby
  # @!endgroup
#   ^^ comment.line.keyword.punctuation.yard.ruby
#     ^^^^^^^^ comment.line.keyword.yard.ruby
  #
  # @!macro [attach] property
#   ^^ comment.line.keyword.punctuation.yard.ruby
#     ^^^^^ comment.line.keyword.yard.ruby
#           ^ comment.line.type.yard.ruby comment.line.punctuation.yard.ruby
#            ^^^^^^ comment.line.type.yard.ruby
#                  ^ comment.line.type.yard.ruby comment.line.punctuation.yard.ruby
#                    ^^^^^^^^ comment.line.number-sign.ruby comment.line.parameter.yard.ruby
  #   @return [$2] the $1 property
# ^ punctuation.definition.comment.ruby
#     ^ comment.line.keyword.punctuation.yard.ruby
#      ^^^^^^ comment.line.keyword.yard.ruby
#             ^ comment.line.type.yard.ruby comment.line.punctuation.yard.ruby
#              ^^ comment.line.type.yard.ruby
#                ^ comment.line.type.yard.ruby comment.line.punctuation.yard.ruby
#                 ^^^^^^^^^^^^^^^^^ comment.line.number-sign.ruby comment.line.string.yard.ruby comment.line.number-sign.ruby comment.line.string.yard.ruby
  #
  # @!method quit(username, message = "Quit")
#   ^^ comment.line.keyword.punctuation.yard.ruby
#     ^^^^^^ comment.line.keyword.yard.ruby
#           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ comment.line.number-sign.ruby comment.line.string.yard.ruby
  #   Sends a quit message to the server for a +username+.
#  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ comment.line.number-sign.ruby comment.line.string.yard.ruby
  #   @param username [String] the username to quit
#     ^ comment.line.keyword.punctuation.yard.ruby
#      ^^^^^ comment.line.keyword.yard.ruby
#            ^^^^^^^^ comment.line.parameter.yard.ruby
#                     ^ comment.line.type.yard.ruby comment.line.punctuation.yard.ruby
#                      ^^^^^^ comment.line.type.yard.ruby
#                            ^ comment.line.type.yard.ruby comment.line.punctuation.yard.ruby
#                             ^^^^^^^^^^^^^^^^^^^^^^ comment.line.number-sign.ruby comment.line.string.yard.ruby comment.line.number-sign.ruby comment.line.string.yard.ruby
  #   @param message [String] the quit message
#     ^ comment.line.keyword.punctuation.yard.ruby
#      ^^^^^ comment.line.keyword.yard.ruby
#            ^^^^^^^ comment.line.parameter.yard.ruby
#                    ^ comment.line.type.yard.ruby comment.line.punctuation.yard.ruby
#                     ^^^^^^ comment.line.type.yard.ruby
#                           ^ comment.line.type.yard.ruby comment.line.punctuation.yard.ruby
#                            ^^^^^^^^^^^^^^^^^^ comment.line.number-sign.ruby comment.line.string.yard.ruby comment.line.number-sign.ruby comment.line.string.yard.ruby
  #
  # includes "UserMixin" and extends "UserMixin::ClassMethods"
#  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ comment.line.number-sign.ruby
  # using the UserMixin.included callback.
#  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ comment.line.number-sign.ruby
  # @!parse include UserMixin
#   ^^ comment.line.keyword.punctuation.yard.ruby
#     ^^^^^ comment.line.keyword.yard.ruby
#          ^^^^^^^^^^^^^^^^^^^ comment.line.number-sign.ruby comment.line.string.yard.ruby
  # @!parse extend UserMixin::ClassMethods{}
# ^ punctuation.definition.comment.ruby
#   ^^ comment.line.keyword.punctuation.yard.ruby
#     ^^^^^ comment.line.keyword.yard.ruby
#          ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ comment.line.number-sign.ruby comment.line.string.yard.ruby
  #
  # @!parse [c]
#   ^^ comment.line.keyword.punctuation.yard.ruby
#     ^^^^^ comment.line.keyword.yard.ruby
#           ^ comment.line.type.yard.ruby comment.line.punctuation.yard.ruby
#            ^ comment.line.type.yard.ruby
#             ^ comment.line.type.yard.ruby comment.line.punctuation.yard.ruby
  #   void Init_Foo() {
#  ^^^^^^^^^^^^^^^^^^^^^ comment.line.number-sign.ruby comment.line.string.yard.ruby
  #     rb_define_method(rb_cFoo, "method", method, 0);
#  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ comment.line.number-sign.ruby comment.line.string.yard.ruby
  #   }
#  ^^^^^ comment.line.number-sign.ruby comment.line.string.yard.ruby
  #
  # @!scope class
# ^ punctuation.definition.comment.ruby
#   ^^ comment.line.keyword.punctuation.yard.ruby
#     ^^^^^ comment.line.keyword.yard.ruby
#          ^^^^^^^ comment.line.number-sign.ruby comment.line.string.yard.ruby
  #
  # @!visibility private
# ^ punctuation.definition.comment.ruby
#   ^^ comment.line.keyword.punctuation.yard.ruby
#     ^^^^^^^^^^ comment.line.keyword.yard.ruby
#               ^^^^^^^^^ comment.line.number-sign.ruby comment.line.string.yard.ruby
