#!/bin/zsh -ex

echo "Check if nvim is available"
which nvim

echo "Check if vim alias is set"
which vim

echo "Check that plugins are installed"
nvim --headless -s $DOTS/nvim/tagbar.test.vim
nvim --headless -s $DOTS/nvim/lsp-clangd.test.vim

