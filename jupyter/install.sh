#!/bin/bash

set -e 

echo "copying jupyter config"
cp ~/.dotfiles/jupyter/jupyter_notebook_config.py ~/.jupyter/
echo "symlink jupyter password setup"
ln -sf ~/jupyter_notebook_config.json ~/.jupyter/

# install in .pyenv/ rather than using --user. `pyenv global XXX` needs to have been set
echo "installing jupyter extensions"
pip3 install jupyter
