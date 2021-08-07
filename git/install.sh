#!/bin/bash -e

if [ "$(uname)" == "Darwin" ]; then
  brew install git
elif [[ "$(lsb_release -i)" == *"Ubuntu"* ]]; then
  sudo apt-get install -y git
fi
