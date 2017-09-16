#!/bin/bash

export DOKKU_DIR="$HOME/.dokku" && (
  ORIGINAL_FOLDER=$(pwd)
  git clone https://github.com/dokku/dokku.git "$DOKKU_DIR/tmp"
  cd "$DOKKU_DIR/tmp"
  git checkout `git describe --abbrev=0 --tags --match "v[0-9]*" origin`
  cp 'contrib/dokku_client.sh' "$DOKKU_DIR/dokku_client.sh"
  cd $ORIGINAL_FOLDER
  rm -rf "$DOKKU_DIR/tmp"
)
