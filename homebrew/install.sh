#!/bin/sh -ex
#
# Homebrew
#
# This installs some of the common dependencies needed (or at least desired)
# using Homebrew.

# If not OSX, just exit cleanly
if [ "$(uname -s)" != "Darwin" ]; then
  exit 0
fi

source $DOTS/common/brew.sh

ensure_brew_installed

brew cleanup
brew update

# Install homebrew packages
brew_install coreutils spark

# Install reattach-to-user-namespace
# This makes sure that tmux + vim is able to use the system clipboard
brew_install reattach-to-user-namespace

exit 0
