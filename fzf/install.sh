#!/bin/bash

if [ "$(uname)" == "Darwin" ]; then
  brew install curl wget
elif [[ "$(lsb_release -i)" == *"Ubuntu"* ]]; then
  sudo apt-get install -y wget curl git
fi

git clone --depth 1 https://github.com/junegunn/fzf.git ~/.fzf
~/.fzf/install
