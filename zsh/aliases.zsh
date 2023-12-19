# editor
alias c='code'
alias v='vim'

# basic navigation
alias ..='cd ..'
alias ~='cd ~'
alias cdp="cd $PROJECTS"
alias cdd="cd $HOME/.dotfiles"

# Better default commands
alias ll='ls -lh' # List all files in long format
alias mv='mv -i' # Move with confirmation
alias rm='rm -i' # Remove with confirmation
alias mkdir='mkdir -p' # Create parent directories on the fly
alias cls='clear' # Clear the terminal
alias df='df -h' # Disk free in human readable format

# git
alias glogo="git log --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit"

# fzf
alias fzfp="fzf --preview 'bat --color=always --style=numbers,changes,header,grid --line-range :500 {}'"
alias hfzf="h | fzf"
alias vfzf='vim -o `fzfp`'
alias cfzf='code -o `fzfp`'