# The rest of my fun git aliases
alias gpl='git pull'
alias gl = 'git log'
alias glog="git log --graph --pretty=format:'%Cred%h%Creset %an: %s - %Creset %C(yellow)%d%Creset %Cgreen(%cr)%Creset' --abbrev-commit --date=relative"
alias gpsh='git push origin HEAD'

# Remove `+` and `-` from start of diff lines; just rely upon color.
alias gd='git diff --color | sed "s/^\([^-+ ]*\)[-+ ]/\\1/" | less -r'

alias gc='git commit -m'
alias gca='git commit -am'
alias gs='git status -sb' # upgrade your git if -sb breaks for you. it's fun.
