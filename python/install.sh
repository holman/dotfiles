#!/bin/sh

PYVERSION=2.7.11

if test ! $(which pyenv)
then
    echo " Installing pyenv"
    brew install pyenv > /tmp/pyenv-install.log
fi

pyenv install -s $PYVERSION

pyenv global $PYVERSION

pip install virtualenv

pyenv rehash
