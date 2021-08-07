#!/bin/bash -e
set -e

if [[ "$(lsb_release -i)" == *"Ubuntu"* ]]; then
  sudo apt-get install -y python3-virtualenvwrapper
else
  sudo python3 -m ensurepip --upgrade
  sudo python3 -m pip install --upgrade virtualenvwrapper
fi
