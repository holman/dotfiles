#!/usr/bin/env bash
#
# Homebrew Installation

# Check for Homebrew
if test ! "$(which brew)"
then
  echo "  Installing Homebrew for you."

  # Install the correct homebrew for each OS type
  if test "$(uname)" = "Darwin"
  then
    ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
  else
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

  echo " - Install personal casks? (y/n) "
  read -n 1 answer
  if [ "$answer" != "${answer#[Yy]}" ]
  then
    echo '  Installing personal casks...' # new line
    brew bundle --file="$DOTFILES/homebrew/personal_cask.brewfile"
  fi
fi

exit 0
