#!/bin/bash -e
if [ "$(uname)" == "Darwin" ]; then
  source $DOTS/common/brew.sh
  brew_install tmux
  terminfofile="$(dirname "$0")/tmux-256color.terminfo"
  tic -x "$terminfofile"
elif [[ "$(lsb_release -i)" == *"Ubuntu"* ]]; then
  sudo apt-get install -y tmux
fi
