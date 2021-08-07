#!/bin/bash -e
if [ "$(uname)" == "Darwin" ]; then
  brew install universal-ctags
elif [[ "$(lsb_release -i)" == *"Ubuntu"* ]]; then
  sudo apt-get install -y --no-install-recommends universal-ctags
fi
