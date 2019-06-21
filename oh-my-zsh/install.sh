#!/bin/sh

export ZSH=~/.oh-my-zsh

if [ ! -d $ZSH ]; then
  git clone https://github.com/robbyrussell/oh-my-zsh.git $ZSH
  cd $ZSH/tools || exit
  sh install.sh
fi
