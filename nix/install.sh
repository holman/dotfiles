#!/bin/bash

#
# Nix
#
# This installs the nix package manager.
#

if test ! $(which nix-env)
then
  echo " Install Nix for you."

  # single user installation. For multiuser installation, check the nix docs
  if test "$(uname)" = "Darwin"
  then
    sh <(curl -L https://nixos.org/nix/install)
  elif test "$(expr substr $(uname -s) 1 5)" = "Linux"
  then
    sh <(curl -L https://nixos.org/nix/install) --no-daemon
  fi
fi

exit 0
