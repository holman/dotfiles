#!/usr/bin/env bash

# manual rsync for terminal themes
rsync -ah --no-perms --exclude "install.sh" "$DOTFILES"/macos/terminal_themes ~/;
