#!/bin/sh

# Install NVM and then Node
if [ ! -d "$NVM_DIR" ]; then
  # Install manually: https://github.com/creationix/nvm#manual-install
  echo "› Installing nvm (Node Version Manager)"

  export NVM_DIR="$HOME/.nvm" && (
    git clone https://github.com/creationix/nvm.git "$NVM_DIR"
    cd "$NVM_DIR"
    git checkout `git describe --abbrev=0 --tags --match "v[0-9]*" $(git rev-list --tags --max-count=1)`
  ) && \. "$NVM_DIR/nvm.sh"

  echo " Installing latest Node LTS as default"
  nvm install --lts
else
  echo "› Upgrading NVM (Node Version Manager)"
   # Upgrade manually: https://github.com/creationix/nvm#manual-upgrade
  (
    cd "$NVM_DIR"
    git fetch --tags origin
    git checkout `git describe --abbrev=0 --tags --match "v[0-9]*" $(git rev-list --tags --max-count=1)`
  ) && \. "$NVM_DIR/nvm.sh"
fi

# https://www.npmjs.com/package/spoof
if test ! $(which spoof)
then
  npm install spoof -g
fi
