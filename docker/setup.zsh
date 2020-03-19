eval $(docker-machine env default)

if test $(docker-machine status | grep -q 'Running'); then
  echo "  starting default docker machine"
  docker-machine start default
fi
