#!/bin/sh
#
# Vim
#

# Variables
REPO_URL="git@github.com:christoomey/vim-tmux-navigator.git"
REPO_DIR="~/.vim/pack/plugins/start/vim-tmux-navigator"

# Check if the directory exists and is a Git repository
if [ -d "$REPO_DIR" ]; then
    if [ -d "$REPO_DIR/.git" ]; then
        echo "Directory $REPO_DIR exists and is a Git repository."
        echo "Fetching the latest changes..."
        cd "$REPO_DIR" || exit
        git fetch --all
        git pull
    else
        echo "Directory $REPO_DIR exists but is not a Git repository. Exiting."
        exit 1
    fi
else
    echo "Directory $REPO_DIR does not exist. Cloning the repository..."
    git clone "$REPO_URL" "$REPO_DIR"
fi

exit 0
