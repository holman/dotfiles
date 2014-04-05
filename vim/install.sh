#!/bin/sh
checkout_path=~/.vim/bundle/vundle

if [ -d "$checkout_path" ]; then
  cd $checkout_path
  git pull --rebase
else
  git clone https://github.com/gmarik/vundle.git $checkout_path
fi
