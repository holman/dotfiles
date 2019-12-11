eval $(docker-machine env default)

# docker-machine status | grep -q 'Running' &>/dev/null
# if [ $? == 0]; then
if test $(docker-machine status | grep -q 'Running'); then
  echo "  starting default docker machine"
  docker-machine start default
fi
