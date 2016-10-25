#!/usr/bin/env bash
echo "Initializing powerline submodule"

# Initialize the submodule and make sure the install script exists
cd ..
git submodule init
git submodule update --recursive

echo "Installing powerline fonts"

# Execute the provided install script
./powerline/install.sh