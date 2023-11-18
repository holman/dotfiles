# SYNTAX TEST "source.ruby"

find!(id: 1, id2: 2)
#     ^^ constant.language.symbol.hashkey.ruby
#       ^ punctuation.definition.constant.hashkey.ruby
#            ^^^ constant.language.symbol.hashkey.ruby
#               ^ punctuation.definition.constant.hashkey.ruby
find!({ id: 1, id2: 2 })
#       ^^ constant.language.symbol.hashkey.ruby
#         ^ punctuation.definition.constant.hashkey.ruby
#              ^^^ constant.language.symbol.hashkey.ruby
#                 ^ punctuation.definition.constant.hashkey.ruby

Candidate.find!(id: 1, id2: 2)
#               ^^ constant.language.symbol.hashkey.ruby
#                 ^ punctuation.definition.constant.hashkey.ruby
#                      ^^^ constant.language.symbol.hashkey.ruby
#                         ^ punctuation.definition.constant.hashkey.ruby
Candidate.find!({ id: 1, id2: 2 })
#                 ^^ constant.language.symbol.hashkey.ruby
#                   ^ punctuation.definition.constant.hashkey.ruby
#                        ^^^ constant.language.symbol.hashkey.ruby
#                           ^ punctuation.definition.constant.hashkey.ruby

{
  # ^ punctuation.section.scope.begin.ruby
      simple_key: :value,
  #   ^^^^^^^^^^ constant.language.symbol.hashkey.ruby
  #             ^ constant.language.symbol.hashkey.ruby punctuation.definition.constant.hashkey.ruby
  #               ^ constant.language.symbol.ruby punctuation.definition.constant.ruby
  #                ^^^^^ constant.language.symbol.ruby
  #                     ^ punctuation.separator.object.ruby
      ends_with_question_mark?: :value,
  #   ^^^^^^^^^^^^^^^^^^^^^^^^ constant.language.symbol.hashkey.ruby
  #                           ^ constant.language.symbol.hashkey.ruby punctuation.definition.constant.hashkey.ruby
  #                             ^ constant.language.symbol.ruby punctuation.definition.constant.ruby
  #                              ^^^^^ constant.language.symbol.ruby
  #                                   ^ punctuation.separator.object.ruby
      ends_with_excalm_key!: :value
  #   ^^^^^^^^^^^^^^^^^^^^^ constant.language.symbol.hashkey.ruby
  #                        ^ constant.language.symbol.hashkey.ruby punctuation.definition.constant.hashkey.ruby
  #                          ^ constant.language.symbol.ruby punctuation.definition.constant.ruby
  #                           ^^^^^ constant.language.symbol.ruby
    }
  # ^ punctuation.section.scope.end.ruby
  
    def method({ simple_key: :value, ends_with_question_mark?: :value, ends_with_excalm_key!: :value })
  # ^^^ meta.function.method.with-arguments.ruby keyword.control.def.ruby
  #    ^ meta.function.method.with-arguments.ruby
  #     ^^^^^^ meta.function.method.with-arguments.ruby entity.name.function.ruby
  #           ^ meta.function.method.with-arguments.ruby punctuation.definition.parameters.ruby
  #            ^ meta.function.method.with-arguments.ruby punctuation.section.scope.begin.ruby
  #             ^ meta.function.method.with-arguments.ruby meta.syntax.ruby.start-block
  #              ^^^^^^^^^^ meta.function.method.with-arguments.ruby constant.language.symbol.hashkey.ruby
  #                        ^ meta.function.method.with-arguments.ruby constant.language.symbol.hashkey.ruby punctuation.definition.constant.hashkey.ruby
  #                         ^ meta.function.method.with-arguments.ruby
  #                          ^ meta.function.method.with-arguments.ruby constant.language.symbol.ruby punctuation.definition.constant.ruby
  #                           ^^^^^ meta.function.method.with-arguments.ruby constant.language.symbol.ruby
  #                                ^ meta.function.method.with-arguments.ruby punctuation.separator.object.ruby
  #                                 ^ meta.function.method.with-arguments.ruby
  #                                  ^^^^^^^^^^^^^^^^^^^^^^^^ meta.function.method.with-arguments.ruby constant.language.symbol.hashkey.ruby
  #                                                          ^ meta.function.method.with-arguments.ruby constant.language.symbol.hashkey.ruby punctuation.definition.constant.hashkey.ruby
  #                                                           ^ meta.function.method.with-arguments.ruby
  #                                                            ^ meta.function.method.with-arguments.ruby constant.language.symbol.ruby punctuation.definition.constant.ruby
  #                                                             ^^^^^ meta.function.method.with-arguments.ruby constant.language.symbol.ruby
  #                                                                  ^ meta.function.method.with-arguments.ruby punctuation.separator.object.ruby
  #                                                                   ^ meta.function.method.with-arguments.ruby
  #                                                                    ^^^^^^^^^^^^^^^^^^^^^ meta.function.method.with-arguments.ruby constant.language.symbol.hashkey.ruby
  #                                                                                         ^ meta.function.method.with-arguments.ruby constant.language.symbol.hashkey.ruby punctuation.definition.constant.hashkey.ruby
  #                                                                                          ^ meta.function.method.with-arguments.ruby
  #                                                                                           ^ meta.function.method.with-arguments.ruby constant.language.symbol.ruby punctuation.definition.constant.ruby
  #                                                                                            ^^^^^ meta.function.method.with-arguments.ruby constant.language.symbol.ruby
  #                                                                                                 ^ meta.function.method.with-arguments.ruby
  #                                                                                                  ^ meta.function.method.with-arguments.ruby punctuation.section.scope.end.ruby
  #                                                                                                   ^ meta.function.method.with-arguments.ruby punctuation.definition.parameters.ruby
      nil
  #   ^^^ constant.language.nil.ruby
    end
  # ^^^ keyword.control.ruby
  
    def method(simple_key: :value, ends_with_question_mark?: :value, ends_with_excalm_key!: :value)
  # ^^^ meta.function.method.with-arguments.ruby keyword.control.def.ruby
  #    ^ meta.function.method.with-arguments.ruby
  #     ^^^^^^ meta.function.method.with-arguments.ruby entity.name.function.ruby
  #           ^ meta.function.method.with-arguments.ruby punctuation.definition.parameters.ruby
  #            ^^^^^^^^^^ meta.function.method.with-arguments.ruby constant.other.symbol.hashkey.parameter.function.ruby
  #                      ^ meta.function.method.with-arguments.ruby constant.other.symbol.hashkey.parameter.function.ruby punctuation.definition.constant.ruby
  #                       ^ meta.function.method.with-arguments.ruby
  #                        ^ meta.function.method.with-arguments.ruby constant.language.symbol.ruby punctuation.definition.constant.ruby
  #                         ^^^^^ meta.function.method.with-arguments.ruby constant.language.symbol.ruby
  #                              ^ meta.function.method.with-arguments.ruby punctuation.separator.object.ruby
  #                               ^ meta.function.method.with-arguments.ruby
  #                                ^^^^^^^^^^^^^^^^^^^^^^^^ meta.function.method.with-arguments.ruby constant.other.symbol.hashkey.parameter.function.ruby
  #                                                        ^ meta.function.method.with-arguments.ruby constant.other.symbol.hashkey.parameter.function.ruby punctuation.definition.constant.ruby
  #                                                         ^ meta.function.method.with-arguments.ruby
  #                                                          ^ meta.function.method.with-arguments.ruby constant.language.symbol.ruby punctuation.definition.constant.ruby
  #                                                           ^^^^^ meta.function.method.with-arguments.ruby constant.language.symbol.ruby
  #                                                                ^ meta.function.method.with-arguments.ruby punctuation.separator.object.ruby
  #                                                                 ^ meta.function.method.with-arguments.ruby
  #                                                                  ^^^^^^^^^^^^^^^^^^^^^ meta.function.method.with-arguments.ruby constant.other.symbol.hashkey.parameter.function.ruby
  #                                                                                       ^ meta.function.method.with-arguments.ruby constant.other.symbol.hashkey.parameter.function.ruby punctuation.definition.constant.ruby
  #                                                                                        ^ meta.function.method.with-arguments.ruby
  #                                                                                         ^ meta.function.method.with-arguments.ruby constant.language.symbol.ruby punctuation.definition.constant.ruby
  #                                                                                          ^^^^^ meta.function.method.with-arguments.ruby constant.language.symbol.ruby
  #                                                                                               ^ meta.function.method.with-arguments.ruby punctuation.definition.parameters.ruby
      nil
  #   ^^^ constant.language.nil.ruby
    end
  # ^^^ keyword.control.ruby
  
    def method { simple_key: :value, ends_with_question_mark?: :value, ends_with_excalm_key!: :value }
  # ^^^ meta.function.method.with-arguments.ruby keyword.control.def.ruby
  #    ^ meta.function.method.with-arguments.ruby
  #     ^^^^^^ meta.function.method.with-arguments.ruby entity.name.function.ruby
  #           ^ meta.function.method.with-arguments.ruby
  #            ^ meta.function.method.with-arguments.ruby punctuation.section.scope.begin.ruby
  #             ^ meta.function.method.with-arguments.ruby meta.syntax.ruby.start-block
  #              ^^^^^^^^^^ meta.function.method.with-arguments.ruby constant.language.symbol.hashkey.ruby
  #                        ^ meta.function.method.with-arguments.ruby constant.language.symbol.hashkey.ruby punctuation.definition.constant.hashkey.ruby
  #                         ^ meta.function.method.with-arguments.ruby
  #                          ^ meta.function.method.with-arguments.ruby constant.language.symbol.ruby punctuation.definition.constant.ruby
  #                           ^^^^^ meta.function.method.with-arguments.ruby constant.language.symbol.ruby
  #                                ^ meta.function.method.with-arguments.ruby punctuation.separator.object.ruby
  #                                 ^ meta.function.method.with-arguments.ruby
  #                                  ^^^^^^^^^^^^^^^^^^^^^^^^ meta.function.method.with-arguments.ruby constant.language.symbol.hashkey.ruby
  #                                                          ^ meta.function.method.with-arguments.ruby constant.language.symbol.hashkey.ruby punctuation.definition.constant.hashkey.ruby
  #                                                           ^ meta.function.method.with-arguments.ruby
  #                                                            ^ meta.function.method.with-arguments.ruby constant.language.symbol.ruby punctuation.definition.constant.ruby
  #                                                             ^^^^^ meta.function.method.with-arguments.ruby constant.language.symbol.ruby
  #                                                                  ^ meta.function.method.with-arguments.ruby punctuation.separator.object.ruby
  #                                                                   ^ meta.function.method.with-arguments.ruby
  #                                                                    ^^^^^^^^^^^^^^^^^^^^^ meta.function.method.with-arguments.ruby constant.language.symbol.hashkey.ruby
  #                                                                                         ^ meta.function.method.with-arguments.ruby constant.language.symbol.hashkey.ruby punctuation.definition.constant.hashkey.ruby
  #                                                                                          ^ meta.function.method.with-arguments.ruby
  #                                                                                           ^ meta.function.method.with-arguments.ruby constant.language.symbol.ruby punctuation.definition.constant.ruby
  #                                                                                            ^^^^^ meta.function.method.with-arguments.ruby constant.language.symbol.ruby
  #                                                                                                 ^ meta.function.method.with-arguments.ruby
  #                                                                                                  ^ meta.function.method.with-arguments.ruby punctuation.section.scope.end.ruby
      nil
  #   ^^^ constant.language.nil.ruby
    end
  # ^^^ keyword.control.ruby
  
    def method simple_key: :value, ends_with_question_mark?: :value, ends_with_excalm_key!: :value
  # ^^^ meta.function.method.with-arguments.ruby keyword.control.def.ruby
  #    ^ meta.function.method.with-arguments.ruby
  #     ^^^^^^ meta.function.method.with-arguments.ruby entity.name.function.ruby
  #           ^ meta.function.method.with-arguments.ruby
  #            ^^^^^^^^^^ meta.function.method.with-arguments.ruby constant.other.symbol.hashkey.parameter.function.ruby
  #                      ^ meta.function.method.with-arguments.ruby constant.other.symbol.hashkey.parameter.function.ruby punctuation.definition.constant.ruby
  #                       ^ meta.function.method.with-arguments.ruby
  #                        ^ meta.function.method.with-arguments.ruby constant.language.symbol.ruby punctuation.definition.constant.ruby
  #                         ^^^^^ meta.function.method.with-arguments.ruby constant.language.symbol.ruby
  #                              ^ meta.function.method.with-arguments.ruby punctuation.separator.object.ruby
  #                               ^ meta.function.method.with-arguments.ruby
  #                                ^^^^^^^^^^^^^^^^^^^^^^^^ meta.function.method.with-arguments.ruby constant.other.symbol.hashkey.parameter.function.ruby
  #                                                        ^ meta.function.method.with-arguments.ruby constant.other.symbol.hashkey.parameter.function.ruby punctuation.definition.constant.ruby
  #                                                         ^ meta.function.method.with-arguments.ruby
  #                                                          ^ meta.function.method.with-arguments.ruby constant.language.symbol.ruby punctuation.definition.constant.ruby
  #                                                           ^^^^^ meta.function.method.with-arguments.ruby constant.language.symbol.ruby
  #                                                                ^ meta.function.method.with-arguments.ruby punctuation.separator.object.ruby
  #                                                                 ^ meta.function.method.with-arguments.ruby
  #                                                                  ^^^^^^^^^^^^^^^^^^^^^ meta.function.method.with-arguments.ruby constant.other.symbol.hashkey.parameter.function.ruby
  #                                                                                       ^ meta.function.method.with-arguments.ruby constant.other.symbol.hashkey.parameter.function.ruby punctuation.definition.constant.ruby
  #                                                                                        ^ meta.function.method.with-arguments.ruby
  #                                                                                         ^ meta.function.method.with-arguments.ruby constant.language.symbol.ruby punctuation.definition.constant.ruby
  #                                                                                          ^^^^^ meta.function.method.with-arguments.ruby constant.language.symbol.ruby
      nil
  #   ^^^ constant.language.nil.ruby
    end
  # ^^^ keyword.control.ruby
  
    foo.method { simple_key: :value, ends_with_question_mark?: :value, ends_with_excalm_key!: :value }
  # ^^^ variable.other.ruby
  #    ^ punctuation.separator.method.ruby
  #     ^^^^^^ meta.function-call.ruby entity.name.function.ruby
  #            ^ punctuation.section.scope.begin.ruby
  #             ^ meta.syntax.ruby.start-block
  #              ^^^^^^^^^^ constant.language.symbol.hashkey.ruby
  #                        ^ constant.language.symbol.hashkey.ruby punctuation.definition.constant.hashkey.ruby
  #                          ^ constant.language.symbol.ruby punctuation.definition.constant.ruby
  #                           ^^^^^ constant.language.symbol.ruby
  #                                ^ punctuation.separator.object.ruby
  #                                  ^^^^^^^^^^^^^^^^^^^^^^^^ constant.language.symbol.hashkey.ruby
  #                                                          ^ constant.language.symbol.hashkey.ruby punctuation.definition.constant.hashkey.ruby
  #                                                            ^ constant.language.symbol.ruby punctuation.definition.constant.ruby
  #                                                             ^^^^^ constant.language.symbol.ruby
  #                                                                  ^ punctuation.separator.object.ruby
  #                                                                    ^^^^^^^^^^^^^^^^^^^^^ constant.language.symbol.hashkey.ruby
  #                                                                                         ^ constant.language.symbol.hashkey.ruby punctuation.definition.constant.hashkey.ruby
  #                                                                                           ^ constant.language.symbol.ruby punctuation.definition.constant.ruby
  #                                                                                            ^^^^^ constant.language.symbol.ruby
  #                                                                                                  ^ punctuation.section.scope.end.ruby
  
    foo.method simple_key: :value, ends_with_question_mark?: :value, ends_with_excalm_key!: :value
  # ^^^ variable.other.ruby
  #    ^ punctuation.separator.method.ruby
  #     ^^^^^^ meta.function-call.ruby entity.name.function.ruby
  #            ^^^^^^^^^^ constant.language.symbol.hashkey.ruby
  #                      ^ constant.language.symbol.hashkey.ruby punctuation.definition.constant.hashkey.ruby
  #                        ^ constant.language.symbol.ruby punctuation.definition.constant.ruby
  #                         ^^^^^ constant.language.symbol.ruby
  #                              ^ punctuation.separator.object.ruby
  #                                ^^^^^^^^^^^^^^^^^^^^^^^^ constant.language.symbol.hashkey.ruby
  #                                                        ^ constant.language.symbol.hashkey.ruby punctuation.definition.constant.hashkey.ruby
  #                                                          ^ constant.language.symbol.ruby punctuation.definition.constant.ruby
  #                                                           ^^^^^ constant.language.symbol.ruby
  #                                                                ^ punctuation.separator.object.ruby
  #                                                                  ^^^^^^^^^^^^^^^^^^^^^ constant.language.symbol.hashkey.ruby
  #                                                                                       ^ constant.language.symbol.hashkey.ruby punctuation.definition.constant.hashkey.ruby
  #                                                                                         ^ constant.language.symbol.ruby punctuation.definition.constant.ruby
  #                                                                                          ^^^^^ constant.language.symbol.ruby
  
    foo.method(simple_key: :value, ends_with_question_mark?: :value, ends_with_excalm_key!: :value)
  # ^^^ variable.other.ruby
  #    ^ punctuation.separator.method.ruby
  #     ^^^^^^ meta.function-call.ruby entity.name.function.ruby
  #           ^ punctuation.section.function.ruby
  #            ^^^^^^^^^^ constant.language.symbol.hashkey.ruby
  #                      ^ constant.language.symbol.hashkey.ruby punctuation.definition.constant.hashkey.ruby
  #                        ^ constant.language.symbol.ruby punctuation.definition.constant.ruby
  #                         ^^^^^ constant.language.symbol.ruby
  #                              ^ punctuation.separator.object.ruby
  #                                ^^^^^^^^^^^^^^^^^^^^^^^^ constant.language.symbol.hashkey.ruby
  #                                                        ^ constant.language.symbol.hashkey.ruby punctuation.definition.constant.hashkey.ruby
  #                                                          ^ constant.language.symbol.ruby punctuation.definition.constant.ruby
  #                                                           ^^^^^ constant.language.symbol.ruby
  #                                                                ^ punctuation.separator.object.ruby
  #                                                                  ^^^^^^^^^^^^^^^^^^^^^ constant.language.symbol.hashkey.ruby
  #                                                                                       ^ constant.language.symbol.hashkey.ruby punctuation.definition.constant.hashkey.ruby
  #                                                                                         ^ constant.language.symbol.ruby punctuation.definition.constant.ruby
  #                                                                                          ^^^^^ constant.language.symbol.ruby
  #                                                                                               ^ punctuation.section.function.ruby
  
    foo.method({ simple_key: :value, ends_with_question_mark?: :value, ends_with_excalm_key!: :value })
  # ^^^ variable.other.ruby
  #    ^ punctuation.separator.method.ruby
  #     ^^^^^^ meta.function-call.ruby entity.name.function.ruby
  #           ^ punctuation.section.function.ruby
  #            ^ punctuation.section.scope.begin.ruby
  #             ^ meta.syntax.ruby.start-block
  #              ^^^^^^^^^^ constant.language.symbol.hashkey.ruby
  #                        ^ constant.language.symbol.hashkey.ruby punctuation.definition.constant.hashkey.ruby
  #                          ^ constant.language.symbol.ruby punctuation.definition.constant.ruby
  #                           ^^^^^ constant.language.symbol.ruby
  #                                ^ punctuation.separator.object.ruby
  #                                  ^^^^^^^^^^^^^^^^^^^^^^^^ constant.language.symbol.hashkey.ruby
  #                                                          ^ constant.language.symbol.hashkey.ruby punctuation.definition.constant.hashkey.ruby
  #                                                            ^ constant.language.symbol.ruby punctuation.definition.constant.ruby
  #                                                             ^^^^^ constant.language.symbol.ruby
  #                                                                  ^ punctuation.separator.object.ruby
  #                                                                    ^^^^^^^^^^^^^^^^^^^^^ constant.language.symbol.hashkey.ruby
  #                                                                                         ^ constant.language.symbol.hashkey.ruby punctuation.definition.constant.hashkey.ruby
  #                                                                                           ^ constant.language.symbol.ruby punctuation.definition.constant.ruby
  #                                                                                            ^^^^^ constant.language.symbol.ruby
  #                                                                                                  ^ punctuation.section.scope.end.ruby
  #                                                                                                   ^ punctuation.section.function.ruby
  
    method(simple_key: :value, ends_with_question_mark?: :value, ends_with_excalm_key!: :value)
  # ^^^^^^ meta.function-call.ruby entity.name.function.ruby
  #       ^ meta.function-call.ruby punctuation.section.function.ruby
  #        ^^^^^^^^^^ meta.function-call.ruby constant.language.symbol.hashkey.ruby
  #                  ^ meta.function-call.ruby constant.language.symbol.hashkey.ruby punctuation.definition.constant.hashkey.ruby
  #                   ^ meta.function-call.ruby
  #                    ^ meta.function-call.ruby constant.language.symbol.ruby punctuation.definition.constant.ruby
  #                     ^^^^^ meta.function-call.ruby constant.language.symbol.ruby
  #                          ^ meta.function-call.ruby punctuation.separator.object.ruby
  #                           ^ meta.function-call.ruby
  #                            ^^^^^^^^^^^^^^^^^^^^^^^^ meta.function-call.ruby constant.language.symbol.hashkey.ruby
  #                                                    ^ meta.function-call.ruby constant.language.symbol.hashkey.ruby punctuation.definition.constant.hashkey.ruby
  #                                                     ^ meta.function-call.ruby
  #                                                      ^ meta.function-call.ruby constant.language.symbol.ruby punctuation.definition.constant.ruby
  #                                                       ^^^^^ meta.function-call.ruby constant.language.symbol.ruby
  #                                                            ^ meta.function-call.ruby punctuation.separator.object.ruby
  #                                                             ^ meta.function-call.ruby
  #                                                              ^^^^^^^^^^^^^^^^^^^^^ meta.function-call.ruby constant.language.symbol.hashkey.ruby
  #                                                                                   ^ meta.function-call.ruby constant.language.symbol.hashkey.ruby punctuation.definition.constant.hashkey.ruby
  #                                                                                    ^ meta.function-call.ruby
  #                                                                                     ^ meta.function-call.ruby constant.language.symbol.ruby punctuation.definition.constant.ruby
  #                                                                                      ^^^^^ meta.function-call.ruby constant.language.symbol.ruby
  #                                                                                           ^ meta.function-call.ruby punctuation.section.function.ruby
  
    method({ simple_key: :value, ends_with_question_mark?: :value, ends_with_excalm_key!: :value })
  # ^^^^^^ meta.function-call.ruby entity.name.function.ruby
  #       ^ meta.function-call.ruby punctuation.section.function.ruby
  #        ^ meta.function-call.ruby punctuation.section.scope.begin.ruby
  #         ^ meta.function-call.ruby meta.syntax.ruby.start-block
  #          ^^^^^^^^^^ meta.function-call.ruby constant.language.symbol.hashkey.ruby
  #                    ^ meta.function-call.ruby constant.language.symbol.hashkey.ruby punctuation.definition.constant.hashkey.ruby
  #                     ^ meta.function-call.ruby
  #                      ^ meta.function-call.ruby constant.language.symbol.ruby punctuation.definition.constant.ruby
  #                       ^^^^^ meta.function-call.ruby constant.language.symbol.ruby
  #                            ^ meta.function-call.ruby punctuation.separator.object.ruby
  #                             ^ meta.function-call.ruby
  #                              ^^^^^^^^^^^^^^^^^^^^^^^^ meta.function-call.ruby constant.language.symbol.hashkey.ruby
  #                                                      ^ meta.function-call.ruby constant.language.symbol.hashkey.ruby punctuation.definition.constant.hashkey.ruby
  #                                                       ^ meta.function-call.ruby
  #                                                        ^ meta.function-call.ruby constant.language.symbol.ruby punctuation.definition.constant.ruby
  #                                                         ^^^^^ meta.function-call.ruby constant.language.symbol.ruby
  #                                                              ^ meta.function-call.ruby punctuation.separator.object.ruby
  #                                                               ^ meta.function-call.ruby
  #                                                                ^^^^^^^^^^^^^^^^^^^^^ meta.function-call.ruby constant.language.symbol.hashkey.ruby
  #                                                                                     ^ meta.function-call.ruby constant.language.symbol.hashkey.ruby punctuation.definition.constant.hashkey.ruby
  #                                                                                      ^ meta.function-call.ruby
  #                                                                                       ^ meta.function-call.ruby constant.language.symbol.ruby punctuation.definition.constant.ruby
  #                                                                                        ^^^^^ meta.function-call.ruby constant.language.symbol.ruby
  #                                                                                             ^ meta.function-call.ruby
  #                                                                                              ^ meta.function-call.ruby punctuation.section.scope.end.ruby
  #                                                                                               ^ meta.function-call.ruby punctuation.section.function.ruby
  
    method { simple_key: :value, ends_with_question_mark?: :value, ends_with_excalm_key!: :value }
  # ^^^^^^ variable.other.ruby
  #        ^ punctuation.section.scope.begin.ruby
  #         ^ meta.syntax.ruby.start-block
  #          ^^^^^^^^^^ constant.language.symbol.hashkey.ruby
  #                    ^ constant.language.symbol.hashkey.ruby punctuation.definition.constant.hashkey.ruby
  #                      ^ constant.language.symbol.ruby punctuation.definition.constant.ruby
  #                       ^^^^^ constant.language.symbol.ruby
  #                            ^ punctuation.separator.object.ruby
  #                              ^^^^^^^^^^^^^^^^^^^^^^^^ constant.language.symbol.hashkey.ruby
  #                                                      ^ constant.language.symbol.hashkey.ruby punctuation.definition.constant.hashkey.ruby
  #                                                        ^ constant.language.symbol.ruby punctuation.definition.constant.ruby
  #                                                         ^^^^^ constant.language.symbol.ruby
  #                                                              ^ punctuation.separator.object.ruby
  #                                                                ^^^^^^^^^^^^^^^^^^^^^ constant.language.symbol.hashkey.ruby
  #                                                                                     ^ constant.language.symbol.hashkey.ruby punctuation.definition.constant.hashkey.ruby
  #                                                                                       ^ constant.language.symbol.ruby punctuation.definition.constant.ruby
  #                                                                                        ^^^^^ constant.language.symbol.ruby
  #                                                                                              ^ punctuation.section.scope.end.ruby
  
    method simple_key: :value, ends_with_question_mark?: :value, ends_with_excalm_key!: :value
  # ^^^^^^ variable.other.ruby
  #        ^^^^^^^^^^ constant.language.symbol.hashkey.ruby
  #                  ^ constant.language.symbol.hashkey.ruby punctuation.definition.constant.hashkey.ruby
  #                    ^ constant.language.symbol.ruby punctuation.definition.constant.ruby
  #                     ^^^^^ constant.language.symbol.ruby
  #                          ^ punctuation.separator.object.ruby
  #                            ^^^^^^^^^^^^^^^^^^^^^^^^ constant.language.symbol.hashkey.ruby
  #                                                    ^ constant.language.symbol.hashkey.ruby punctuation.definition.constant.hashkey.ruby
  #                                                      ^ constant.language.symbol.ruby punctuation.definition.constant.ruby
  #                                                       ^^^^^ constant.language.symbol.ruby
  #                                                            ^ punctuation.separator.object.ruby
  #                                                              ^^^^^^^^^^^^^^^^^^^^^ constant.language.symbol.hashkey.ruby
  #                                                                                   ^ constant.language.symbol.hashkey.ruby punctuation.definition.constant.hashkey.ruby
  #                                                                                     ^ constant.language.symbol.ruby punctuation.definition.constant.ruby
  #                                                                                      ^^^^^ constant.language.symbol.ruby
