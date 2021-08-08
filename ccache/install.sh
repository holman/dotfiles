#!/bin/bash -e

if [ "$(uname)" == "Darwin" ]; then
  brew install ccache
elif [[ "$(lsb_release -i)" == *"Ubuntu"* ]]; then
  sudo apt-get install ccache
fi

