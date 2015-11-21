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

  # Install the correct homebrew for each OS type
  if test "$(uname)" = "Darwin"
  then
    ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
  elif test "$(expr substr $(uname -s) 1 5)" = "Linux"
  then
    ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/linuxbrew/go/install)"

    echo 'export PATH="$HOME/.linuxbrew/bin:$PATH"' > ~/.bashrc
    echo 'export MANPATH="$HOME/.linuxbrew/share/man:$MANPATH"' > ~/.bashrc
    echo 'export INFOPATH="$HOME/.linuxbrew/share/info:$INFOPATH"' > ~/.bashrc

    echo 'export PATH="$HOME/.linuxbrew/bin:$PATH"' > ~/.zshrc
    echo 'export MANPATH="$HOME/.linuxbrew/share/man:$MANPATH"' > ~/.zshrc
    echo 'export INFOPATH="$HOME/.linuxbrew/share/info:$INFOPATH"' > ~/.zshrc

  fi

fi

brew tap homebrew/bundle
brew bundle --global

exit 0
