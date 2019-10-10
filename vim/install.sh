#!/bin/bash

# Installing vim because the apple-supplied vim is outdated
# Furthermore has('macunix') does not work in apple vim
# That breaks latex-suite mac specifics
if [ "$(uname -s)" = "Darwin" ]; then
  brew reinstall macvim --HEAD --with-cscope --with-lua --with-override-system-vim
  # Ensure that vim and python are compiled with the same version
  brew install python
elif [[ "$(lsb_release -i)" == *"Ubuntu"* ]]; then
  sudo apt-get install -y vim-gtk3
fi

# update packages in vundle
# install vundle if not already installed
if [ ! -d ~/.vim/bundle/Vundle.vim ]; then
  $(dirname $0)/../git/install.sh
  git clone https://github.com/gmarik/Vundle.vim.git ~/.vim/bundle/Vundle.vim
fi
vim +BundleInstall +qall

