#!/bin/sh
# update packages in vundle

# install vundle if not already installed
if [ ! -d ~/.vim/bundle/Vundle.vim ]; then
  git clone https://github.com/gmarik/Vundle.vim.git ~/.vim/bundle/Vundle.vim
fi
zsh -c 'source $ZSH/plugins/vundle/vundle.plugin.zsh; vundle'
