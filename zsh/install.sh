#!/bin/zsh
set -e

checkout_path=~/.oh-my-zsh

if [ -d "$checkout_path" ]; then
  source ${checkout_path}/lib/functions.zsh
  upgrade_oh_my_zsh
else
  git clone git://github.com/robbyrussell/oh-my-zsh.git $checkout_path
fi
