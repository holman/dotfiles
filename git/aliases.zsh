# Use `hub` as our git wrapper:
#   http://defunkt.github.com/hub/
#
# I use JRuby substantially, and we want to make sure hub is run using MRI
# regardless of which Ruby you're using or else the `git status` in your prompt
# will take seven thousand seconds to run `ls`.
#
# I'm hardcoding it to an installed rvm (using rvm's `rvm 1.8.7,ruby /hub/path`
# syntax is way too slow). It should work fine for those without rvm, though.
if [[ -s $HOME/.rvm/scripts/rvm ]] 
then
  alias git='$HOME/.rvm/rubies/ruby-1.8.7-p334/bin/ruby `which hub`'
fi

# The rest of my fun git aliases
alias gl='git pull --prune'
alias glog="git log --graph --pretty=format:'%Cred%h%Creset %an: %s - %Creset %C(yellow)%d%Creset %Cgreen(%cr)%Creset' --abbrev-commit --date=relative"
alias gp='git push origin HEAD'
alias gd='git diff'
alias gc='git commit'
alias gca='git commit -a'
alias gco='git checkout'
alias gb='git branch'
alias gs='git status -sb' # upgrade your git if -sb breaks for you. it's fun.
alias grm="git status | grep deleted | awk '{print \$3}' | xargs git rm"
