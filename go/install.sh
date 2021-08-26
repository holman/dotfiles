#!/bin/sh
#
# goenv
#
# This installs goenv if it's not installed

# Check for goenv
if test ! "$(which goenv)"
then
  echo "Installing goenv for you."
  git clone https://github.com/syndbg/goenv.git ~/.goenv
  eval "$(goenv init -)"
  export GOENV_ROOT="$HOME/.goenv"
  export PATH="$GOENV_ROOT/bin:$PATH"
  if ! goenv list | grep -q "$GOENV_ROOT/versions/go1.16.0"; then
    echo "Installing go 1.16.0 for you"
    goenv install 1.16.0
  fi
fi

exit 0
