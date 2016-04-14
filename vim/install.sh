#!/bin/sh

# Installing vim because the apple-supplied vim is outdated
# Furthermore has('macunix') does not work in apple vim
# That breaks latex-suite mac specifics
if [ "$(uname -s)" = "Darwin" ]; then
  brew reinstall macvim --HEAD --with-cscope --with-lua --with-override-system-vim
  # To make sure that ycm has the correct python version
  brew install python
fi

# update packages in vundle
# install vundle if not already installed
if [ ! -d ~/.vim/bundle/Vundle.vim ]; then
  git clone https://github.com/gmarik/Vundle.vim.git ~/.vim/bundle/Vundle.vim
fi
zsh -c 'source $ZSH/plugins/vundle/vundle.plugin.zsh; vundle'

# Additional steps necessary for you-complete-me
# Added in this file to ensure that vundle + you-complete-me where installed
# first
echo "Installing you-complete-me native extensions"
cd ~/.vim/bundle/YouCompleteMe || exit 1
git submodule update --init --recursive
./install.py --clang-completer
