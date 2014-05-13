#!/bin/bash
#
# Homebrew
#
# This installs some of the common dependencies needed (or at least desired)
# using Homebrew.

if [[ "$(uname -s)" != "Darwin" ]]; then
  pprint error "Unsupported OS"
  exit 0
fi

# Check for Homebrew
if test ! $(which brew); then
  pprint step "Installing Homebrew for you"
  ruby -e "$(curl -fsSL https://raw.github.com/Homebrew/homebrew/go/install)" > /tmp/homebrew-install.dot.log 2>&1

  if [[ $? != 0 ]]; then
    pprint error "Failed to install Homebrew"
    exit 1
  else
    pprint ok "Homebrew is ready to brew. Choo, choo!"
  fi
fi

# Install homebrew packages
brew install coreutils grc > /tmp/homebrew-dependencies.dot.log 2>&1

if [[ $? != 0 ]]; then
  pprint error "Failed to install dependencies"
  exit 1
fi

pprint ok "Installed dotfiles dependencies"
exit 0
