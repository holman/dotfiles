# Use `hub` as our git wrapper:
#   http://defunkt.github.com/hub/
hub_path=$(command -v hub)
if (( $+commands[hub] ))
then
  alias git=$hub_path
fi

# The rest of my fun git aliases
# LOG & DIFF
alias glog="git log --graph --pretty=format:'%Cred%h%Creset %an: %s - %Creset %C(yellow)%d%Creset %Cgreen(%cr)%Creset' --abbrev-commit --date=relative"
# Remove `+` and `-` from start of diff lines; just rely upon color.
alias gd='git diff --color | sed "s/^\([^-+ ]*\)[-+ ]/\\1/" | less -r'

# PUSH
alias gp='git push origin HEAD'
alias gpu='git push -u origin head'

# PULL
alias gpp='git pull --prune'
alias gpr='git pull --rebase'

# COMMIT
alias gc='git commit'
alias gca='git commit -a'
alias gcm='git commit -m'
alias gac='git add -A && git commit'
alias gwip='git add -A . && git commit -m "wip"'

# Checkout, branches etc
alias gco='git checkout'
alias gcb='git copy-branch-name'
alias gb='git branch'

# STATUS + working on stuff
alias gst='git status'
alias gs='git status -sb' # upgrade your git if -sb breaks for you. it's fun.
# This will open any newly created files in your editor. See bin/git-edit-new
alias ge='git-edit-new'
