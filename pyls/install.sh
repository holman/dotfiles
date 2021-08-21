#!/bin/bash -e

if [[ "$(uname)" == "Linux" && "$(lsb_release -i)" == *"Ubuntu"* ]]; then
  sudo apt-get install -y --no-install-recommends python3-pip
fi

# Install autopep8 to activate optional source formatting in pyls
sudo pip3 install --upgrade python-language-server autopep8
