#!/bin/sh
#
# Homebrew
#
# This installs some of the common dependencies needed (or at least desired)
# using Homebrew.
source ./install/utils.sh

# Check for Homebrew
if test ! $(which brew)
then
  info "installing homebrew for you."

  # Install the correct homebrew for each OS type
  if test "$(uname)" = "Darwin"
  then
    ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
  elif test "$(expr substr $(uname -s) 1 5)" = "Linux"
  then
    ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/linuxbrew/go/install)"
  fi
  success "homebrew installed successfully"	
else
  success "homebrew already installed"	
fi

info "installing from Brewfile"
xcode-select --install
brew bundle

exit 0
