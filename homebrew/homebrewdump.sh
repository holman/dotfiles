#!/bin/sh
cd ~/.dotfiles/homebrew
rm Brewfile
# need to add to PATH: https://github.com/Homebrew/homebrew-bundle/issues/237
PATH=/usr/local/bin:${PATH}
#/usr/local/bin/brew bundle dump 2>&1 | tee log  (debugging)
/usr/local/bin/brew bundle dump
