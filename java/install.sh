#!/usr/bin/env bash

# install java
if ! [ -f /Library/Java/JavaVirtualMachines/openjdk.jdk ]
then
  echo "setting java to use brew install openjdk"
  sudo ln -sfn /usr/local/opt/openjdk/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk.jdk
fi
