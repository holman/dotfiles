alias reload!='exec $SHELL'

# Inspired by https://xebia.com/blog/profiling-zsh-shell-scripts/
function benchmark_reload! {
  PS4=$'\\\011%D{%s%6.}\011%x\011%I\011%N\011%e\011'
  local out_file
  out_file=/tmp/zshstart.$$.log
  exec 3>&2 2>$out_file
  setopt xtrace prompt_subst
  for i in {1..10}; do
    echo Run $i...
    reload!
  done
  unsetopt xtrace
  exec 2>&3 3>&-
  echo Trace written to $out_file
  echo Analyze with for example https://github.com/raboof/zshprof/
}


if which xdg-open &> /dev/null; then
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
