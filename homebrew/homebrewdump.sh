#!/bin/sh
cd ~/.dotfiles/homebrew
rm Brewfile
/usr/local/bin/brew bundle dump
