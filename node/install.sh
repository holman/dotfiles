#!/bin/sh

if test ! $(which nvm)
then
    echo " Installing NVM"
    curl https://raw.github.com/creationix/nvm/master/install.sh | sh
fi

nvm install 0.10

nvm use 0.10

npm -g install bower gulp grunt-cli yeoman
