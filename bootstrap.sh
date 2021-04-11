#!/bin/bash

if [ -d /Library ]; then
  echo "Bootstraping Mac ..."
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
  brew install git
else
  echo "Bootstraping Linux ..."
fi
