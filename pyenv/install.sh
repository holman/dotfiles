#!/bin/bash

set -e

# mac
#brew install openssl readline sqlite3 xz zlib
#sudo installer -pkg /Library/Developer/CommandLineTools/Packages/macOS_SDK_headers_for_macOS_10.14.pkg -target / ???

# pyenv deps
sudo apt-get install git python-pip make build-essential libssl-dev zlib1g-dev libbz2-dev libreadline-dev libsqlite3-dev curl -y
sudo pip install virtualenvwrapper

if cd ~/.pyenv;
    then echo "~/.pyenv exists, skipping installation";
    else curl https://pyenv.run | bash
fi
cd ~/.dotfiles

# python build deps
sudo apt-get update; sudo apt-get install --no-install-recommends make build-essential libssl-dev zlib1g-dev libbz2-dev libreadline-dev libsqlite3-dev wget curl llvm libncurses5-dev xz-utils tk-dev libxml2-dev libxmlsec1-dev libffi-dev liblzma-dev -y


