#!/bin/zsh -ex

echo "Check if nvim is available"
which nvim

echo "Check if vim alias is set"
which vim

echo "Check that plugins are installed"
nvim --headless -s $DOTS/nvim/tagbar.test.vim
nvim --headless -s $DOTS/nvim/lsp-clangd.test.vim
nvim --headless -s $DOTS/nvim/lsp-pyls.test.vim
nvim --headless -s $DOTS/nvim/completion.test.vim
nvim --headless -s $DOTS/nvim/sneak.test.vim

echo "Check if startup is sufficiently fast"
measure-runtime.py --repeat=10 --expected-ms 250 nvim +qall
