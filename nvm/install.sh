#!/bin/sh
#
#NVM

# Check for NVM
if test ! $(which nvm)
then
  echo "  Installing nvm for you."
  curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.8/install.sh | bash

fi

exit 0
