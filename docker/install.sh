# Following these set up instructions: https://pewpewthespells.com/blog/setup_docker_on_mac.html
#----------------
if test $(which brew); then
  if test ! $(which docker); then
    echo "  installing docker"
    brew install docker
  fi

  if test ! $(which docker-machine); then
    echo "  installing docker-machine"
    brew install docker-machine
  fi

  if test ! $(which docker-machine-driver-xhyve); then
    echo "  installing docker-machine-driver-xhyve"
    brew install docker-machine-driver-xhyve
    echo "  changing permissions for the hypervisor vm"
    sudo chown root:wheel /usr/local/opt/docker-machine-driver-xhyve/bin/docker-machine-driver-xhyve
    sudo chmod u+s /usr/local/opt/docker-machine-driver-xhyve/bin/docker-machine-driver-xhyve
  fi

  docker-machine ls | grep -q 'default' &>/dev/null
  if [ $? == 1 ]; then
    echo "  creating default machine using hypervision"
    docker-machine create --driver xhyve default
  fi
fi
