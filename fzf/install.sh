#!/bin/sh

if test ! $(which fzf)
then
	echo "  Installing fzf"
	brew install fzf
  #install fzf utilities
  /usr/local/opt/fzf/install
fi
