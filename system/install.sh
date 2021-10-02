#!/bin/bash -e

if [ "$(uname -s)" = "Darwin" ]; then
  source $DOTS/common/brew.sh
  brew_install ncdu
elif [[ "$(lsb_release -i)" == *"Ubuntu"* ]]; then
  sudo apt-get install -y ncdu
fi
