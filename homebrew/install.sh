#!/bin/sh
#
# Homebrew
#
# This installs some of the common dependencies needed (or at least desired)
# using Homebrew.

# Check for Homebrew
if test ! $(which brew)
then
  echo "  Installing Homebrew for you."
  ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
fi

brew tap Goles/battery
# Install homebrew packages
brew install grc coreutils spark git hub gibo battery fzf zsh-syntax-highlighting vim ag

#install fzf utilities
/usr/local/opt/fzf/install
exit 0
