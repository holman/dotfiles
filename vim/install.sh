#!/usr/bin/env bash
set -e

# Install directions
# https://github.com/VundleVim/Vundle.vim

INSTALL_DIR='~/.vim/bundle/Vundle.vim'
if [ ! -d "$INSTALL_DIR" ] ; then
  echo "Cloning VIM Vundle"
  git clone https://github.com/VundleVim/Vundle.vim.git "$INSTALL_DIR"
else
  echo "Updating VIM Vundle"
  pushd "$INSTALL_DIR"
  git pull
  popd
fi

# Run Vim commend to install all
echo "Installing VIM Vundle Plugins"
vim +BundleInstall +qall
