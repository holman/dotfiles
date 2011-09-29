alias reload!='. ~/.zshrc'

# LS
LS_COMMON="-hBF"
test -n "$LS_COMMON" &&
alias ls="command ls $LS_COMMON"

alias ll="ls -l"
alias la="ls -A"
alias lla="ls -lA"
alias l.="ls -d .*"

