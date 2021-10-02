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

# Check for Homebrew
if test ! "$(which brew)"
then
  echo "  Installing Homebrew for you."
  ruby -e "$(curl -fsSL https://raw.github.com/Homebrew/homebrew/go/install)" > /tmp/homebrew-install.log
fi

# Update all outdates packages
brew cleanup
brew update
brew upgrade

# Install homebrew packages
brew install coreutils spark

# Install reattach-to-user-namespace
# This makes sure that tmux + vim is able to use the system clipboard
brew install reattach-to-user-namespace

exit 0
