#!/bin/sh
checkout_path=~/.oh-my-zsh

if [ -d "$checkout_path" ]; then
  upgrade_oh_my_zsh
else
  git clone git://github.com/robbyrussell/oh-my-zsh.git $checkout_path
fi
