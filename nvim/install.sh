#!/bin/bash

# Installing vim because the apple-supplied vim is outdated
# Furthermore has('macunix') does not work in apple vim
# That breaks latex-suite mac specifics
if [ "$(uname -s)" = "Darwin" ]; then
  # If this installed version crashes, install from source instead.
  brew reinstall --HEAD neovim
elif [[ "$(lsb_release -i)" == *"Ubuntu"* ]]; then
  sudo snap install --edge nvim --classic
  sudo snap refresh --edge nvim --classic
fi
sudo pip3 install --upgrade pynvim

# update packages in Plug
# install plug if not already installed
plug_dir="${XDG_DATA_HOME:-$HOME/.local/share}"/nvim/site/autoload/plug.vim
if [ ! -d "$plug_dir" ]; then
  curl -fLo "${plug_dir}" --create-dirs https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim
fi
nvim +PlugUpdate +qall

