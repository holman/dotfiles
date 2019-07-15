#!/usr/bin/env bash

# If its mac install workflows & Library configs
if test "$(uname)" = "Darwin"
then
  rsync --exclude "README.md" \
    --exclude ".DS_Store" \
    --exclude "install.sh" \
    -ah --no-perms "$DOTFILES"/Library/* ~/Library
else
  echo 'On Linux not Running Library/install.sh'
fi

exit 0
