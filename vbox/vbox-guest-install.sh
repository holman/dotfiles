#!/bin/sh

set -e
set -x

# run inside Linux VM when CD is added
# installs guest additions

VER=$(ls -l /media/$USER/ | grep VBox_GAs | awk -F_ '{print $3}' | sort -n | head -n 1)
cd /media/$USER/VBox_GAs_$VER
sudo sh VBoxLinuxAdditions.run

exit 0
