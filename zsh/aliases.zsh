alias reload!='. ~/.zshrc'

if [[ "$(uname -s)" == "Linux" ]]; then
  alias open="xdg-open"
fi

function disas_impl() {
  objdump -drwCS -Mintel $1 || gobjdump -drwCS -Mintel $1;
}


alias p4s="git p4 submit -M"
alias gvim="gvim --remote-tab-silent"
alias cdtmp='cd $(mktemp -d)'
alias disas='disas_impl'
