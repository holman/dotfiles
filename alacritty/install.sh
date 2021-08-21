#!/bin/bash -e
if [ "$(uname)" == "Darwin" ]; then
  brew install alacritty
elif [[ "$(lsb_release -i)" == *"Ubuntu"* ]]; then
  sudo snap install alacritty --classic
fi

