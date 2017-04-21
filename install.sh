#!/bin/bash

echo "Installing Homebrew..."
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

echo "Installing LFTP..."
brew install lftp

echo "Installing diff-so-fancy..."
brew install diff-so-fancy

echo "Installing Silver Searcher (ag)..."
brew install ag

echo "Installing npm..."
brew install npm

echo "Symlinking dotfiles..."
ln -s $HOME/.dotfiles/bash/bash_profile.symlink $HOME/.bash_profile
ln -s $HOME/.dotfiles/bash/bashrc.symlink $HOME/.bashrc

echo "Symlinking tmux.conf..."
ln -s $HOME/.dotfiles/tmux/tmux.conf.symlink $HOME/.tmux.conf

echo "Symlinking vim..."
ln -s $HOME/.dotfiles/vim/vimrc.symlink $HOME/.vimrc
ln -s $HOME/.dotfiles/vim/vim.symlink $HOME/.vim

echo "Symlinking git..."
ln -s $HOME/.dotfiles/git/gitconfig.symlink $HOME/.gitconfig
ln -s $HOME/.dotfiles/git/gitignore.symlink $HOME/.gitignore
ln -s $HOME/.dotfiles/git/githelpers.symlink $HOME/.githelpers

echo "Symlinking gemrc..."
ln -s $HOME/.dotfiles/gemrc.symlink $HOME/.gemrc

echo "Symlinking sublime..."
ln -s $HOME/.dotfiles/sublime/user.symlink $HOME/Library/Application\ Support/Sublime\ Text\ 2/Packages/User
