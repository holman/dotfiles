#!/bin/sh
#
# Homebrew
#
# This installs some of the common dependencies needed (or at least desired)
# using Homebrew.

# Check for Homebrew
if test ! "$(which brew)"
then
  echo "  Installing Homebrew for you."

  # Install the correct homebrew for each OS type
  if test "$(uname)" = "Darwin"
  then
    ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
  elif test "$(expr substr $(uname -s) 1 5)" = "Linux"
  then
    ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Linuxbrew/install/master/install)"
  fi
fi

# Turn off brew analytics
brew analytics off
brew bundle --file="$DOTFILES/homebrew/universal_cli.brewfile"

# install universal casks on mac
if test "$(uname)" = "Darwin"
then
  brew bundle --file="$DOTFILES/homebrew/universal_cask.brewfile"

  echo "  Install personal casks? (y/n) "
  read answer
  if [ "$answer" != "${answer#[Yy]}" ]
  then
    brew bundle --file="$DOTFILES/homebrew/personal_cask.brewfile"
  fi
fi

exit 0
