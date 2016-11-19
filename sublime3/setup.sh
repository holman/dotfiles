#!/bin/sh
# Setup a machine for Sublime Text 3
set -x

# Symlink settings
sublime_dir=~/Library/Application\ Support/Sublime\ Text\ 3/Packages
mv "$sublime_dir/User" "$sublime_dir/User.backup"
ln -s "$ZSH/sublime3/User" "$sublime_dir"

# Symlink sublime CLI helper
if [[ ! -a /usr/local/bin/sublime ]]
then
  ln -s "/Applications/Sublime Text.app/Contents/SharedSupport/bin/subl" /usr/local/bin/sublime
fi
