#!/bin/sh
checkout_path=~/.oh-my-zsh

if [ -d "$checkout_path" ]; then
  /usr/bin/env ZSH=$ZSH /bin/sh $ZSH/tools/upgrade.sh
else
  git clone git://github.com/robbyrussell/oh-my-zsh.git $checkout_path
fi
