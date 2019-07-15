#!/usr/bin/env bash

if ! [ -d ~/.nano ]
then
  echo "Cloning fantastic nano syntax repo"
  git clone https://github.com/scopatz/nanorc ~/.nano
fi
# Manual Updates
git -C ~/.nano pull --quiet
