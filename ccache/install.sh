#!/bin/bash -e

if [ "$(uname)" == "Darwin" ]; then
  source $DOTS/common/brew.sh
  brew_install ccache
elif [[ "$(lsb_release -i)" == *"Ubuntu"* ]]; then
  # Installing build-essential to have a working compiler for the test.sh
  # Not necessary on macOS as a full llvm is installed
  source $DOTS/common/apt.sh
  apt_install ccache build-essential
fi

