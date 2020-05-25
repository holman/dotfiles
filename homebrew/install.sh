#!/bin/sh
#
# Homebrew
#
# This installs some of the common dependencies needed (or at least desired)
# using Homebrew.

if test ! "$(uname)" = "Darwin"
  then
  exit 0
fi

# Check for Homebrew
if test ! $(which brew)
then

  # Install the correct homebrew for each OS type
  echo "  Installing Homebrew for you."
  ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

  #elif test "$(expr substr $(uname -s) 1 5)" = "Linux"
  #then
    #ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Linuxbrew/install/master/install)"
  #fi

fi

# Install python3
brew install python3

exit 0
