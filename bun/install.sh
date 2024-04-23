#!/bin/sh
#
# Bun
#

# Check for bun
if test ! $(which bun)
then
  echo "  Installing Bun for you."

  ruby -e "$(curl -fsSL https://bun.sh/install | bash)"
fi

exit 0