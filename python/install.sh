#!/bin/sh

# install Python2
brew install python > /tmp/python2-install.log

# install Python3
brew install python3 > /tmp/python3-install.log

# install virtualenv for Python2
pip install virtualenv

# install virtualenv for Python3
pip3 install virtualenv
