# The rest of my fun git aliases
alias gpl='git pull'
alias glog="git log --graph --pretty=format:'%Cred%h%Creset %an: %s - %Creset %C(yellow)%d%Creset %Cgreen(%cr)%Creset' --abbrev-commit --date=relative"
alias gpsh='git push origin HEAD'

# Remove `+` and `-` from start of diff lines; just rely upon color.
alias gd='git diff --color'

alias gr='git rm -r'
alias ga='git add'
alias gc='git commit -m'
alias gac='git commit -am'
alias gcb='git checkout'
alias gs='git status -sb' # upgrade your git if -sb breaks for you. it's fun.
