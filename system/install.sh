#!/bin/bash -e

if [ "$(uname -s)" = "Darwin" ]; then
  brew install ncdu
elif [[ "$(lsb_release -i)" == *"Ubuntu"* ]]; then
  sudo apt-get install -y ncdu
fi
