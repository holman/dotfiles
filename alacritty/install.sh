#!/bin/bash -e
if [ "$(uname)" == "Darwin" ]; then
  source $DOTS/common/brew.sh
  brew_install alacritty
elif [[ "$(lsb_release -i)" == *"Ubuntu"* ]]; then
  sudo snap install alacritty --classic
fi

