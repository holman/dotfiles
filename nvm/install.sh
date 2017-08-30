#!/bin/bash

export NVM_DIR="$HOME/.nvm" && (
  git clone https://github.com/creationix/nvm.git "$NVM_DIR"
  cd "$NVM_DIR"
  git checkout `git describe --abbrev=0 --tags --match "v[0-9]*" origin`
) && . "$NVM_DIR/nvm.sh"

[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" # This loads nvm

nvm install lts/*
nvm alias default lts/*
nvm use lts/*

yarn global add npm@latest bower grunt-cli gulp-cli webpack webpack-dev-server ghost-cli
