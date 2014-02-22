#!/bin/sh

# Fortune cookies
if test ! $(which fortune)
then
  echo "  Installing fortune for you."
  brew install fortune > /tmp/fortune-install.log  
fi

# More cowbells, more cows
if test ! $(which cowsay)
then
  echo "  Installing cowsay for you."
  brew install cowsay > /tmp/cowsay-install.log  
fi
