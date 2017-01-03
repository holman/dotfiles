alias d='docker $*'
alias d-c='docker-compose $*'

alias docker-prune='docker ps -a | grep Exited | awk '"'"'{ print $1 }'"'"' | xargs docker rm'
 
function dockerenv () {
  local args=${@:-default}
  eval $(docker-machine env $args)
 }
 
 function docker-empty () {
   docker ps -aq | xargs --no-run-if-empty docker rm -f
 }
