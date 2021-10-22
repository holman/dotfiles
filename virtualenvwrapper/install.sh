#!/bin/bash -e
set -e

if [ "$(uname -s)" = "Darwin" ]; then
  sudo python3 -m ensurepip --upgrade
  sudo python3 -m pip install --upgrade virtualenvwrapper
elif [[ "$(lsb_release -i)" == *"Ubuntu"* ]]; then
  source $DOTS/common/apt.sh
  apt_install python3-virtualenvwrapper
fi
