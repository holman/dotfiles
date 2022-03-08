#!/bin/bash

# install iterm2 if it's not installed already
if [ ! -d /Applications/iTerm.app ]
then
  ITERM_FILENAME="iTerm2-3_4_15.zip"
  # proceed with installing iTerm
  echo "installing iTerm2"
  cd "$HOME/Downloads"
  curl -O https://iterm2.com/downloads/stable/$ITERM_FILENAME
  unzip $ITERM_FILENAME
  mv iTerm.app /Applications/
  # Specify the custom preferences directory
  defaults write com.googlecode.iterm2.plist PrefsCustomFolder -string "$HOME/.dotfiles/iterm2"
  # Tell iTerm2 to use the custom preferences in the directory
  defaults write com.googlecode.iterm2.plist LoadPrefsFromCustomFolder -bool true
fi
