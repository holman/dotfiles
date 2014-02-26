#!/bin/sh

if test ! $(which npm)
then
  echo "  Installing npm for you."
  brew install npm > /tmp/npm-install.log
fi


if test ! $(which nvm)
then
  echo "  Installing nvm for you."
  brew install nvm > /tmp/nvm-install.log
fi

if test ! $(which node-inspector)
then
  echo "  Installing node-inspector for you."
  sudo npm install -g node-inspector > /tmp/node-inspector-install.log
fi

if test ! $(which nodemon)
then
  echo "  Installing nodemon for you."
  npm install -g nodemon > /tmp/nodemon-install.log
fi
