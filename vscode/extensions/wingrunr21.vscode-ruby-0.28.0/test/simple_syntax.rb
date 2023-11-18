# SYNTAX TEST "source.ruby"

if foo && bar && baz
#  ^^^ variable.other.ruby
#         ^^^ variable.other.ruby
#                ^^^ variable.other.ruby
end

foo && bar && baz
# <--- variable.other.ruby
#      ^^^ variable.other.ruby
#             ^^^ variable.other.ruby

Klass::Klass2::Klass3.instance.meth
#                     ^^^^^^^^ meta.function-call.ruby entity.name.function.ruby
#                              ^^^^ meta.function-call.ruby entity.name.function.ruby

Klass.meth
#     ^^^^ meta.function-call.ruby entity.name.function.ruby
Klass.meth()
#     ^^^^ meta.function-call.ruby entity.name.function.ruby
Klass.meth 'arg', 'arg', 'arg', :arg, methcall
#     ^^^^ meta.function-call.ruby entity.name.function.ruby
Klass.meth('arg', 'arg', 'arg', :arg, methcall)
#     ^^^^ meta.function-call.ruby entity.name.function.ruby

foo(bar(baz()))
# <-- meta.function-call.ruby entity.name.function.ruby
#  ^ punctuation.section.function.ruby
#   ^^^ meta.function-call.ruby entity.name.function.ruby
#      ^ punctuation.section.function.ruby
#       ^^^ meta.function-call.ruby entity.name.function.ruby
#          ^^^^ punctuation.section.function.ruby

!!!!true('foo')
# <---- keyword.operator.logical.ruby
