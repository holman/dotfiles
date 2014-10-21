alias reload!='. ~/.zshrc'

if [[ "$(uname -s)" == "Linux" ]]; then
  alias open="xdg-open"
fi

alias p4s="p4 submit -M"
