# Use `hub` as our git wrapper:
#   http://defunkt.github.com/hub/
#hub_path=$(which hub)
#if (( $+commands[hub] ))
#then
  #alias git=$hub_path
#fi

# The rest of my fun git aliases
alias gl='git pull --prune'
alias glog="git log --graph --pretty=format:'%Cred%h%Creset %an: %s - %Creset %C(yellow)%d%Creset %Cgreen(%cr)%Creset' --abbrev-commit --date=relative"
alias gp='git push origin HEAD'
alias gcb='git copy-branch-name'
alias gs='git status -sb' # upgrade your git if -sb breaks for you. it's fun.
alias wtf='git-wtf'
alias gdt='git difftool'
alias grb='git rebase'
alias grbom='git rebase origin master'
alias gfo='git fetch origin'
alias gfu='git fetch upstream'
