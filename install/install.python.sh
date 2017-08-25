#!/usr/bin/env bash
source ./install/utils.sh

info "installing python versions"

set PYTHON3_VERSION 3.5.2
set PYTHON2_VERSION 2.7.12

# only install if not found
if ! pyenv versions | grep $PYTHON3_VERSION
then
	pyenv install $PYTHON3_VERSION
else
	success "python $PYTHON3_VERSION already installed"
fi

# only install if not found
if ! pyenv versions | grep $PYTHON2_VERSION
then
	pyenv install $PYTHON2_VERSION
else
	success "python $PYTHON2_VERSION already installed"
fi

# set global
pyenv global $PYTHON2_VERSION

pyenv virtualenv $PYTHON2_VERSION neovim2
pyenv activate neovim2
pip install neovim
pyenv which python  # Note the path

pyenv virtualenv $PYTHON3_VERSION neovim3
pyenv activate neovim3
pip install neovim
pyenv which python  # Note the path

# # enable use of pip to install virtual environments
# export PIP_REQUIRE_VIRTUALENV=false

# if ! which virtualenv; then
# 	# install venv globally if it does not exist
# 	pip install virtualenv
# fi

# # prevent usage of pip outside of virtual environment
# export PIP_REQUIRE_VIRTUALENV=false

# # create directory to store virtual environment things
# mkdir -p ~/.virtualenv

# create and activate our default python environment
# cd ~/.virtualenv/
# virtualenv -p python3 neo
# source ~/.virtualenv/neo/bin/activate

# install our neovim dependency
# this is basically the reason for all this mission
# pip3 install -r $DOT_FILES/python/requirements.txt
