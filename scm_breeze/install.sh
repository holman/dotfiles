#!/bin/sh
checkout_path=~/.scm_breeze/

if [ -d "$checkout_path" ]; then
  currDir=$PWD 
  cd "$scmbDir"
  oldHEAD=$(git rev-parse HEAD 2> /dev/null) 
  git pull origin master
  source "$scmbDir/lib/scm_breeze.sh"
  _create_or_patch_scmbrc $oldHEAD
  source "$scmbDir/scm_breeze.sh"
  cd "$currDir"
else
  git clone git://github.com/ndbroadbent/scm_breeze.git $checkout_path
fi
