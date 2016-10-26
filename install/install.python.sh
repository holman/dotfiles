#!/usr/bin/env bash
source ./install/utils.sh

info "installing python versions"

# only install if not found
if ! pyenv versions | grep 3.5.2
then
	pyenv install 3.5.2
else
	success "python 3.5.2 already installed"
fi

# only install if not found
if ! pyenv versions | grep 2.7.12
then
	pyenv install 2.7.12
else
	success "python 2.7.12 already installed"
fi

# set gloval
pyenv global 2.7.12

# enable use of pip to install virtual environments
export PIP_REQUIRE_VIRTUALENV=false

if ! which virtualenv; then
	# install venv globally if it does not exist
	pip install virtualenv
fi

# prevent usage of pip outside of virtual environment
export PIP_REQUIRE_VIRTUALENV=true

# create directory to store virtual environment things
mkdir -p ~/.virtualenv

# create and activate our default python environment
# cd ~/.virtualenv/
# virtualenv -p python3 neo
# source ~/.virtualenv/neo/bin/activate

# install our neovim dependency
# this is basically the reason for all this mission
# pip3 install -r $DOT_FILES/python/requirements.txt
