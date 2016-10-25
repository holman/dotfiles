#!/usr/local/bin/fish

# Install fisherman
# Asynchronous plugin manager for fish shell
curl -Lo ~/.config/fish/functions/fisher.fish --create-dirs git.io/fisher

# Symlink config specially
mkdir -p ~/.config/fish
ln -s ~/.dotfiles/fish/config.fish ~/.config/fish/config.fish

# Install some plugins
# z - change directory figure outer
# fzf - fuzzy finder
# pure - prompt
# bass - use bash scripts in fish (eg. source files)
fisher z fzf rafaelrinaldi/pure edc/bass
