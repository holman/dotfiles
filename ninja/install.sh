#!/bin/bash -e
if [ "$(uname)" == "Darwin" ]; then
  brew install ninja
elif [[ "$(lsb_release -i)" == *"Ubuntu"* ]]; then
  sudo apt-get install -y --no-install-recommends ninja-build
fi

