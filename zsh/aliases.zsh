alias reload!='. ~/.zshrc'

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