# todo.sh: https://github.com/ginatrapani/todo.txt-cli
function t() { 
  if [ $# -eq 0 ]; then
    todo.sh ls
  else
    todo.sh $*
  fi
}
