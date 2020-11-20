#!/bin/bash

set -x

VER=$1
mkdir -p ~/tmp/vbox
cd ~/tmp/vbox
wget https://download.virtualbox.org/virtualbox/$VER/VBoxGuestAdditions_$VER.iso

