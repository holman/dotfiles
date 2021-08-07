#!/bin/bash -e
if [ "$(uname)" == "Darwin" ]; then
  brew install autojump
elif [[ "$(lsb_release -i)" == *"Ubuntu"* ]]; then
  sudo apt-get install -y autojump
fi
