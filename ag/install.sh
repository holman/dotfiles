#!/bin/bash
if [ "$(uname)" == "Darwin" ]; then
  brew install the_silver_searcher
elif [[ "$(lsb_release -i)" == *"Ubuntu"* ]]; then
  sudo apt-get install -y silversearcher-ag
fi
