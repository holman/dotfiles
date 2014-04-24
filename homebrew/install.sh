#!/bin/sh
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
if test ! $(which brew)
then
  echo "  Installing Homebrew for you."
  ruby -e "$(curl -fsSL https://raw.github.com/Homebrew/homebrew/go/install)" > /tmp/homebrew-install.log
fi

# Install homebrew packages
brew install grc coreutils spark

# Installing vim because the apple-supplied vim is outdated
# Furthermore has('macunix') does not work in apple vim
# That breaks latex-suite mac specifics
brew install vim

exit 0
