#!/bin/bash -e

cd "$(dirname "$0")"

if [ "$(uname)" == "Darwin" ]; then
  brew install mosh
elif [[ "$(lsb_release -i)" == *"Ubuntu"* ]]; then
  sudo apt-get install -y mosh
fi
