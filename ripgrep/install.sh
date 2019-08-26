#!/bin/bash
if [ "$(uname)" == "Darwin" ]; then
  brew install ripgrep
elif [[ "$(lsb_release -i)" == *"Ubuntu"* ]]; then
  sudo apt-get -y install curl
  tmpfile=$(mktemp)
  trap "rm -rf ${tmpfile}" EXIT
  curl -Lo "${tmpfile}" https://github.com/BurntSushi/ripgrep/releases/download/11.0.2/ripgrep_11.0.2_amd64.deb
  sudo dpkg -i "${tmpfile}"
fi
