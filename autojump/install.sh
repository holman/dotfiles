#!/bin/sh
if [ "$(uname)" == "Darwin" ]; then
  brew install autojump
elif [ "$(lsb_release -i)" == "Distributor ID: Ubuntu" ]; then
  sudo apt-get install autojump
fi
