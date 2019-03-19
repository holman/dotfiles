alias reload!='. ~/.zshrc'

if [[ "$(uname -s)" == "Linux" ]]; then
  alias open="xdg-open"
fi

function disas_impl() {
  objdump -dlrwCS -Mintel $1 || gobjdump -dlrwCS -Mintel $1;
}

# Source http://wiki.bash-hackers.org/snipplets/print_horizontal_line
func horizontal_divider() {
  printf '%*s\n' "${COLUMNS:-$(tput cols)}" '' | tr ' ' -
}


alias p4s="git p4 submit -M"
alias gvim="gvim --remote-tab-silent"
alias cdtmp='cd $(mktemp -d)'
alias disas='disas_impl'
alias div='horizontal_divider'
alias lt='echo Last 10 modified; ls -ltrh | tail'
