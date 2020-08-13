#!/bin/bash

# Installing vim because the apple-supplied vim is outdated
# Furthermore has('macunix') does not work in apple vim
# That breaks latex-suite mac specifics
if [ "$(uname -s)" = "Darwin" ]; then
  brew reinstall neovim
elif [[ "$(lsb_release -i)" == *"Ubuntu"* ]]; then
  sudo snap install --beta nvim --classic
fi

# update packages in vundle
# install vundle if not already installed
if [ ! -d ~/.vim/bundle/Vundle.vim ]; then
  "$(dirname "$0")/../git/install.sh"
  git clone https://github.com/gmarik/Vundle.vim.git ~/.vim/bundle/Vundle.vim
fi
nvim +BundleInstall +qall

