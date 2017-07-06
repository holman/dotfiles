alias d='docker $*'
alias dco='docker-compose $*'
alias dm='docker-machine $*'

docker-delete-all-untagged-dangled-images() {
  docker rmi $(docker images -q -f dangling=true)
}

docker-kill-all-running(){
  docker kill $(docker ps -q)
}
docker-delete-all-images(){
  docker rmi $(docker images -q)
}

docker-delete-all-stopped-containers(){
  docker rm $(docker ps -a -q)
}

docker-clean() {
  docker ps -a -q -f status=exited | xargs -n 10 docker rm -v
  docker rmi $(docker images -f "dangling=true" -q)
  docker volume rm $(docker volume ls -qf dangling=true)

}

docker-machine-create(){
  echo "Creating machine $1"
  docker-machine create -d virtualbox \
    --virtualbox-cpu-count "4" \
    --virtualbox-disk-size "30000" \
    --virtualbox-memory "3072" \
    --engine-insecure-registry dockerregistry:8085 \
    --engine-opt dns=8.8.8.8 \
    --engine-opt dns=8.8.4.4 \
    --engine-opt dns-search=service.consul \
    $1
  echo $(docker-machine ip) "dockerhost-$1" | sudo tee -a /etc/hosts
}

setMachine(){
  eval $(dm env $1)
}

unsetMachine(){
  eval $(dm env --unset)
}


dps(){
  docker ps --format "table {{.ID}}\t{{.Status}}\t{{.Names}}\t{{.Image}} "
}

docker-ip() {
  dm ip $1
}
