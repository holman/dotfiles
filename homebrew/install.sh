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
if test ! "$(which brew)"
then
  echo "  Installing Homebrew for you."
  ruby -e "$(curl -fsSL https://raw.github.com/Homebrew/homebrew/go/install)" > /tmp/homebrew-install.log
fi

# Update all outdates packages
brew update && brew upgrade `brew outdated`

# Install homebrew packages
brew install coreutils spark ctags

# Install reattach-to-user-namespace
# This makes sure that tmux + vim is able to use the system clipboard
brew install reattach-to-user-namespace --wrap-pbcopy-and-pbpaste

exit 0
