#!/bin/bash -e

cd "$(dirname "$0")"

if [ "$(uname)" == "Darwin" ]; then
  source $DOTS/common/brew.sh
  brew_install mosh
elif [[ "$(lsb_release -i)" == *"Ubuntu"* ]]; then
  sudo apt-get install -y mosh
fi
