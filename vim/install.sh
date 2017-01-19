#!/bin/sh
#
# Vim
#
# This installs some of the common dependencies needed (or at least desired)
# using Vim.

# Check for Vim
if test $(which vim)
then
  echo "  Installing Vundler for you."
  git clone https://github.com/VundleVim/Vundle.vim.git ~/.vim/bundle/Vundle.vim
fi
  
exit 0
