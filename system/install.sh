#!/bin/bash -e

if [ "$(uname -s)" = "Darwin" ]; then
  source $DOTS/common/brew.sh
  brew_install ncdu
elif [[ "$(lsb_release -i)" == *"Ubuntu"* ]]; then
  source $DOTS/common/apt.sh
  apt_install ncdu
fi
