#!/bin/sh

if test ! $(which pyenv)
then
    echo " Installing pyenv"
    brew install pyenv > /tmp/pyenv-install.log
fi
