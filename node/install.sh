#!/bin/sh

# if test ! $(which node)
# then
#   echo "  Installing node for you."
#   brew install node
# fi

if test ! $(which n)
then
  echo " Installing n for node version management."

  # https://github.com/mklement0/n-install
  curl -L http://git.io/n-install | bash -s -- -y lts 0.12
fi
