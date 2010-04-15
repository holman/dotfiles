alias gems='cd $GEM_HOME/gems'

# jruby
alias f='RAILS_ENV=fi'

# rails
alias sc='script/console'
alias ss='script/server -p `~/.dotfiles/zsh/functions/available_rails_port`'
alias sg='script/generate'
alias sd='script/destroy'
alias a='autotest -rails'
alias tlog='tail -f log/development.log'
alias scaffold='script/generate nifty_scaffold'
alias migrate='rake db:migrate db:test:clone'
alias rst='touch tmp/restart.txt'
alias rcov='rake rcov:all'
alias s="ps aux | grep \"[r]uby\" | grep script/server || echo \"You're not running any, dawg.\""
alias deathss='~/.dotfiles/zsh/functions/deathss'