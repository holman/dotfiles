#!/bin/bash
#
# nvm: Node Version Manager
#
# This installs nvm

# Check for nvm
if test ! "$(which nvm)"; then
  echo "Installing nvm..."
  git clone https://github.com/nvm-sh/nvm.git "$NVM_DIR"
  cd "$NVM_DIR"
  git checkout $(git describe --abbrev=0 --tags --match "v[0-9]*" $(git rev-list --tags --max-count=1)) && \. "$NVM_DIR/nvm.sh"
fi
