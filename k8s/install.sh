#!/bin/sh

# Configure minikube to use xhyve/HyperKit
minikube config set vm-driver hyperkit
minikube config set memory 8192
