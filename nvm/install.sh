#!/bin/sh
#
# NVM
#

# Check for nvm
if test ! $(which nvm)
then
  echo "  Installing NVM for you."

  PROFILE=/dev/null
  ruby -e "$(curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash)"
fi

exit 0