alias reload!='. ~/.zshrc'

if [[ "$(uname -s)" == "Linux" ]]; then
  alias open="xdg-open"
fi

alias p4s="git p4 submit -M"
alias gvim="gvim --remote-tab-silent"
alias cdtmp="cd $(mktemp -d)"
