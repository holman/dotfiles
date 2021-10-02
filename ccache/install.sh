#!/bin/bash -e

if [ "$(uname)" == "Darwin" ]; then
  source $DOTS/common/brew.sh
  brew_install ccache
elif [[ "$(lsb_release -i)" == *"Ubuntu"* ]]; then
  sudo apt-get install ccache
fi

