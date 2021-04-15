#!/bin/bash

curl -sfL https://get.k3s.io | sh -
mkdir -p $HOME/.kube
ln -s /etc/rancher/k3s/k3s.yaml $HOME/.kube/config

exit 0
