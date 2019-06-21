#!/usr/bin/env bash

if test ! "$(which brew)"
then
  echo "brew not found installing brew first triggered by python"
  cd "$(dirname $0)"/.. || exit
  sh ./homebrew/install.sh
fi

echo "Configuring Python Make Sure python is first in Path";
pip3 install -q --upgrade pip;
pip3 install -q --upgrade setuptools;
[ ! -d ~/python_virtual_envs ] && mkdir ~/python_virtual_envs;
pip3 install -q flake8;
pip3 install -q black;

[ ! -d ~/Dropbox ] && mkdir ~/Dropbox;
[ ! -d ~/Dropbox/python ] && mkdir ~/Dropbox/python;
