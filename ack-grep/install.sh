#!/bin/bash
if [ "$(uname)" == "Darwin" ]; then
  brew install ack
elif [[ "$(lsb_release -i)" == *"Ubuntu"* ]]; then
  sudo apt-get install -y ack-grep
fi
