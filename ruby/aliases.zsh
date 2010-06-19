alias f='RAILS_ENV=fi'

alias sc='script/console'
alias ss='script/server -p `available_rails_port`'
alias sg='script/generate'
alias sd='script/destroy'

alias migrate='rake db:migrate db:test:clone'

alias s="ps aux | grep \"[r]uby\" | grep script/server || echo \"You're not running any, dawg.\""