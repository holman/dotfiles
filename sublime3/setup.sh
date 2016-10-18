#!/bin/sh
# Setup a machine for Sublime Text 3
set -x

# symlink settings in
sublime_dir=~/Library/Application\ Support/Sublime\ Text\ 3/Packages
mv "$sublime_dir/User" "$sublime_dir/User.backup"
ln -s "$ZSH/sublime3/User" "$sublime_dir"

ln -s "/Applications/Sublime Text.app/Contents/SharedSupport/bin/subl" /usr/local/bin/subl
ln -s "/Applications/Sublime Text.app/Contents/SharedSupport/bin/subl" /usr/local/bin/sublime
