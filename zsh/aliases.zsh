
alias reload=". ~/.zshrc"
alias py="python3"

# Navigation
alias dev="cd /Users/benjirusselburg/dev"
alias home="cd /Users/benjirusselburg"
alias cls="clear" # Good 'ol Clear Screen command

# Git
alias uhhh="git for-each-ref --sort='authordate:iso8601' --format=' %(color:green)%(authordate:relative)%09%(color:white)%(refname:short) / %(contents:subject)' refs/heads"

# Work
alias dcore="cd ~/dev/discourse/discourse"
alias dplugins="cd ~/dev/discourse/plugins"
alias dthemes="cd ~/dev/discourse/themes"
alias dserver="cd ~/dev/discourse/discourse; rm -rf tmp; rails s"
alias dember="cd ~/dev/discourse/discourse; bin/ember-cli"
alias dstart="cd ~/dev/discourse/discourse; bin/ember-cli -u"
alias dinstall="bundle;pnpm install;rake db:migrate"
alias dmigratetest="LOAD_PLUGINS=1 RAILS_ENV=test bin/rake db:migrate"
alias drefresh="cd ~/dev/discourse/discourse;gl;dInstall;dMigrateTest;dStart"
alias dreload="cd ~/dev/discourse/discourse;bin/ember-cli -u"

alias remakedb-test="LOAD_PLUGINS=1 bin/rails db:drop db:create db:migrate RAILS_ENV=test"