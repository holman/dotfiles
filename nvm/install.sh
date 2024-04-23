#!/bin/sh
#
# NVM
#

# Check for nvm
if test $(command -v nvm)
then
  echo "  Installing NVM for you."

  ruby -e "$(PROFILE=/dev/null bash -c 'curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash')"
fi

exit 0