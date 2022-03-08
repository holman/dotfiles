#!/bin/bash

cd $HOME

# check if powerlevel10k already exists
if [ -z "$(find $ZSH_THEMES -name 'powerlevel10k' | head -1)" ]
then
  echo "installing powerlevel10k"
  git clone --depth=1 https://github.com/romkatv/powerlevel10k.git $ZSH_THEMES/powerlevel10k
fi
