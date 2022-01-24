#!/bin/bash

echo "Updating macOS..."
sudo softwareupdate -i -a

echo "Updating Homebrew and its installed packages..."
brew update
brew upgrade
brew cleanup
brew prune
brew cask cleanup

echo "Updating npm and its installed packages..."
npm install npm -g
npm update -g

echo "Updating installed Ruby gems..."
sudo gem update
sudo gem cleanup
