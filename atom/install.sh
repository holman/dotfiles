#!/usr/bin/env bash

# Install Atom Packages
# http://evanhahn.com/atom-apm-install-list/
echo "installing atom packages"
apm install --packages-file $HOME/.atom/packages.txt;
