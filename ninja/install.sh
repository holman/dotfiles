#!/bin/bash -e
if [ "$(uname)" == "Darwin" ]; then
  source $DOTS/common/brew.sh
  brew_install ninja
elif [[ "$(lsb_release -i)" == *"Ubuntu"* ]]; then
  sudo apt-get install -y --no-install-recommends ninja-build
fi

