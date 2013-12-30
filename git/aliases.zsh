# Use `hub` as our git wrapper:
#   http://defunkt.github.com/hub/
alias git='hub'

# The rest of my fun git aliases
alias gl='git pull --prune'
alias glog="git log --graph --pretty=format:'%Cred%h%Creset %an: %s - %Creset %C(yellow)%d%Creset %Cgreen(%cr)%Creset' --abbrev-commit --date=relative"
alias gp='git push origin HEAD'
alias gd='git diff'
alias gc='git commit'
alias gc='git commit -m'
alias gca='git commit -a'
alias gcma='git commit -a -m'
alias gco='git checkout'
alias gb='git branch'
alias gmg='git merge'
alias gs='git status -sb' # upgrade your git if -sb breaks for you. it's fun.
alias gst='git status'
alias grm="git status | grep deleted | awk '{\$1=\$2=\"\"; print \$0}' | \
           perl -pe 's/^[ \t]*//' | sed 's/ /\\\\ /g' | xargs git rm"
