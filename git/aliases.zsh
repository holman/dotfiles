# Use `hub` as our git wrapper:
#   http://defunkt.github.com/hub/
hub_path=$(which hub)
if (( $+commands[hub] ))
then
  alias git=$hub_path
fi

# The rest of my fun git aliases
alias gl='git pull --prune'
alias glog="git log --graph --pretty=format:'%Cred%h%Creset %an: %s - %Creset %C(yellow)%d%Creset %Cgreen(%cr)%Creset' --abbrev-commit --date=relative"
alias gp='git push origin HEAD'
alias gd='git diff'
alias gc='git commit'
alias gca='git commit -a'
alias gco='git checkout'
alias gcb='git copy-branch-name'
alias gb='git branch'
alias gs='git status -sb' # upgrade your git if -sb breaks for you. it's fun.


# custom git shortcuts
alias g='git'
alias gs='git status -sb'
alias gcb='git checkout -b'
alias gch='git checkout'
alias gb='git branch'
# alias gc='git commit -v'
# alias gca='git commit -v -a'
alias gd='git diff | $EDITOR'
alias ga='git add'
alias gl='git log'
alias push='git push'
alias pull='git pull'
alias merge='git merge'

alias such=git
alias very=git
alias wow='git status'
