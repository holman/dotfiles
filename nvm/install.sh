#!/bin/bash

export NVM_DIR="$HOME/.nvm" && (
  git clone https://github.com/creationix/nvm.git "$NVM_DIR"
  cd "$NVM_DIR"
  git checkout `git describe --abbrev=0 --tags --match "v[0-9]*" origin`
) && . "$NVM_DIR/nvm.sh"

nvm install lts/* --latest-npm
nvm install stable --latest-npm
nvm alias default stable
nvm use lts/*
npm config set python python2.7

nvm use stable
npm config set python python2.7
nvm reinstall-packages lts/*

nvm use default
npm config set python python2.7
