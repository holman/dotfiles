#!/bin/bash -e

if [ "$(uname)" == "Darwin" ]; then
  source $DOTS/common/brew.sh
  brew_install git
elif [[ "$(lsb_release -i)" == *"Ubuntu"* ]]; then
  source $DOTS/common/apt.sh
  apt_install git
fi
