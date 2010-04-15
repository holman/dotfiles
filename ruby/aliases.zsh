alias gems='cd /Library/Ruby/Gems/1.8/gems'

alias jgems='cd /usr/local/Cellar/jruby/1.4.0/lib/ruby/gems/1.8/gems'
alias f='RAILS_ENV=fi'

alias sc='script/console'
alias ss='script/server -p `available_rails_port`'
alias sg='script/generate'
alias sd='script/destroy'
alias a='autotest -rails'
alias tlog='tail -f log/development.log'
alias scaffold='script/generate nifty_scaffold'
alias migrate='rake db:migrate db:test:clone'
alias rcov='rake rcov:all'
alias s="ps aux | grep \"[r]uby\" | grep script/server || echo \"You're not running any, dawg.\""