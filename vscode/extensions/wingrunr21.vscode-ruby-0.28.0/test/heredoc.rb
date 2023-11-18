# SYNTAX TEST "source.ruby"
p(<<~'SOMETEXT' , <<~OTHERTEXT, Time.now)
# ^^^^^^^^^^^^^ string.unquoted.heredoc.ruby punctuation.definition.string.begin.ruby
#                 ^^^^^^^^^^^^ string.unquoted.heredoc.ruby string.unquoted.heredoc.ruby punctuation.definition.string.begin.ruby
test1 if unless else "foorbar"
# <------------------------------ string.unquoted.heredoc.ruby
SOMETEXT
# <-------- string.unquoted.heredoc.ruby punctuation.definition.string.end.ruby
test2 if unless else "foobar"
OTHERTEXT

function_call <<-EOS.strip, false, nil, :foo => :bar
#             ^^^^^^ string.unquoted.heredoc.ruby punctuation.definition.string.begin.ruby
#                    ^^^^^ string.unquoted.heredoc.ruby meta.function-call.ruby entity.name.function.ruby
#                           ^^^^^ string.unquoted.heredoc.ruby constant.language.boolean.ruby
#                                  ^^^ string.unquoted.heredoc.ruby constant.language.nil.ruby
#                                       ^^^^ string.unquoted.heredoc.ruby constant.language.symbol.hashkey.ruby
#                                            ^^ string.unquoted.heredoc.ruby punctuation.separator.key-value
#                                               ^^^^ string.unquoted.heredoc.ruby constant.language.symbol.ruby
  the quick
EOS

function_call <<-EOS.strip, false, nil, :foo => :bar
  #{foo}
# ^^^^^^ meta.embedded.line.ruby
EOS

send :method, <<-EOF
  hello
EOF

exec_sql(<<-SQL, 1, 'book')
#        ^^^^^^ meta.embedded.block.sql
SELECT * FROM products WHERE id = ? OR name = ?;
# <----------------------------------------------- meta.embedded.block.sql source.sql
SQL

<<-SLIM
# <------- meta.embedded.block.slim
  .foo
# ^^^^ meta.embedded.block.slim text.slim
    #{bar}
SLIM
