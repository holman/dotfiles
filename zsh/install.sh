#!/bin/bash
set -e

checkout_path=~/.oh-my-zsh

cd "$(dirname "$0")"

if [ "$(uname -s)" = "Darwin" ]; then
  brew install zsh
elif [[ "$(lsb_release -i)" == *"Ubuntu"* ]]; then
  sudo apt-get install -y zsh
fi

if [ -d "$checkout_path" ]; then
  if [[ "x${ZSH}" == "x" ]]; then
    # Older zsh templates did not export ZSH var
    export ZSH=$checkout_path
  fi
  zsh -c "source ${checkout_path}/lib/functions.zsh && upgrade_oh_my_zsh"
else
  ../git/install.sh
  git clone git://github.com/robbyrussell/oh-my-zsh.git $checkout_path
fi
