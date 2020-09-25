#!/bin/bash -e

if [ "$(uname)" == "Darwin" ]; then
  brew install llvm
  # Force it into PATH
  sudo ln -sf "$(brew list llvm | grep 'bin/clangd$' | head -n1)" /usr/local/bin
elif [[ "$(lsb_release -i)" == *"Ubuntu"* ]]; then
  sudo apt-get install -y clangd-9
  sudo update-alternatives --install /usr/bin/clangd clangd /usr/bin/clangd-9 100
fi
