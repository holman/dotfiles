#!/usr/bin/env bash
source ./install/utils.sh

info "initializing powerline submodule"

# Initialize the submodule and make sure the install script exists
git submodule init
git submodule update --recursive

info "installing powerline fonts"

# Execute the provided install script
./powerline/install.sh
