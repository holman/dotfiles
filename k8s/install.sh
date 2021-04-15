#!/bin/bash

if test "$(uname)" = "Darwin"; then
    brew install minikube
else
    curl -sfL https://get.k3s.io | sh -
    mkdir -p $HOME/.kube

    ln -s /etc/rancher/k3s/k3s.yaml $HOME/.kube/k3s.config
fi
exit 0
