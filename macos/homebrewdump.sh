#!/bin/sh
cd ~/.dotfiles/macos
rm Brewfile
/usr/local/bin/brew bundle dump
