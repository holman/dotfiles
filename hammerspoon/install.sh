#~/usr/bin/sh

if [[ ! -a ~/.hammerspoon/anycomplete ]]; then
  echo "Installing Hammerspoon anycomplete scripts"
  git clone https://github.com/nathancahill/anycomplete.git ~/.hammerspoon/anycomplete
  echo "local anycomplete = require \"anycomplete/anycomplete\"" >> ~/.hammerspoon/init.lua
  echo "anycomplete.registerDefaultBindings()" >> ~/.hammerspoon/init.lua
else
  echo "Skipping installing Hammerspoon anycomplete"
fi

echo "Opening Hammerspoon App, reload the configs"
open -a /Applications/Hammerspoon.app
