#!/usr/bin/env bash

# Need to figure how to setup license

# Set Alfred Sync Folder
defaults write com.runningwithcrayons.Alfred-Preferences syncfolder ~/Dropbox/applications/alfred;

# Set Theme
FILE="/Users/$USER/Dropbox/applications/alfred/dracula.alfredappearance;"
[ -f "$FILE" ] && o "$FILE";

# Quit Alfred 3
osascript -e 'quit app "ALFRED"';
