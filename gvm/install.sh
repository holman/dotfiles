#!/bin/sh

if test ! $(gvm)
then
  echo "  Installing gvm for you."
  zsh < <(curl -s -S -L https://raw.githubusercontent.com/moovweb/gvm/master/binscripts/gvm-installer)
  brew install mercurial
fi
