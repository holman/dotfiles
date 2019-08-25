#!/bin/bash
set -e

checkout_path=~/.oh-my-zsh

if [ "$(uname -s)" = "Darwin" ]; then
  brew install zsh
elif [[ "$(lsb_release -i)" == *"Ubuntu"* ]]; then
  sudo apt-get install -y zsh
fi

if [ -d "$checkout_path" ]; then
  if [[ "x${ZSH}" == "x" ]]; then
    # Older zsh templates did not export ZSH var
    ZSH=$checkout_path
  fi
  source ${checkout_path}/lib/functions.zsh
  upgrade_oh_my_zsh
else
  git clone git://github.com/robbyrussell/oh-my-zsh.git $checkout_path
fi
