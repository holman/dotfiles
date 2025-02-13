#!/bin/bash

set -e

if test "$(uname)" = "Darwin"
  # mac
  then
    brew install pyenv
  else
  # ubuntu
    sudo apt-get install git python-pip make build-essential libssl-dev zlib1g-dev libbz2-dev libreadline-dev libsqlite3-dev curl -y
    sudo pip install virtualenvwrapper
    if cd ~/.pyenv;
        then echo "~/.pyenv exists, skipping installation";
        else curl https://pyenv.run | bash
    fi
  # python build deps
  sudo apt-get update; sudo apt-get install --no-install-recommends make build-essential libssl-dev zlib1g-dev libbz2-dev libreadline-dev libsqlite3-dev wget curl llvm libncurses5-dev xz-utils tk-dev libxml2-dev libxmlsec1-dev libffi-dev liblzma-dev -y
fi

# set global python version
version=`cat .python-version`
echo "Installing python ${version} as pyenv default"
pyenv install -s "${version}"
pyenv global "${version}"
cd ~/.dotfiles



