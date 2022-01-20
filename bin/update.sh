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
sudogem cleanup

echo "Updating installed pip packages..."
pip2 freeze --local | grep -v '^\-e' | cut -d = -f 1  | xargs -n1 pip2 install -U;
