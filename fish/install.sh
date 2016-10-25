#!/usr/local/bin/fish

# Install fisherman
# Asynchronous plugin manager for fish shell
curl -Lo ~/.config/fish/functions/fisher.fish --create-dirs git.io/fisher

# Install some plugins
# z - change directory figure outer
# fzf - fuzzy finder
# pure - prompt
fisher z fzf rafaelrinaldi/pure
