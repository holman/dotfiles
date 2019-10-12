#!/bin/sh

sudo chown root:wheel /usr/local/opt/docker-machine-driver-xhyve/bin/docker-machine-driver-xhyve
sudo chmod u+s /usr/local/opt/docker-machine-driver-xhyve/bin/docker-machine-driver-xhyve
# Configure minikube to use xhyve/HyperKit
#minikube config set vm-driver xhyve
minikube config set memory 8192
