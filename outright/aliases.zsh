alias rfu='rake test:functionals; rake test:units'
alias prfu='rake parallel:prepare;rake parallel:migrate;rake parallel:test\[4,\^functional\];rake parallel:test\[4,\^unit\]'
alias tall='cd vendor/outright_gems/lumberjack;rake test:units;cd ../../..;rfu;rake test:integration'
alias ptall='cd vendor/outright_gems/lumberjack;rake test;cd ../../..;prfu;rake test:integration'
alias goo='cd ~/src/or/'
alias goapp='cd ~/src/work/outright'
alias goagg='cd ~/src/work/aggregation'
alias gpom='git pull origin master'
alias godw='cd ~/src/work/warehouse'

alias clean='find ./**/*.orig | xargs rm'

