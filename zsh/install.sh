#!/bin/sh

# TODO : "brew ls --versions myformula" : Check wether a formula is installed or not

if test  $(which tmux)
then
	echo "  Installing tmux and related packages for you."
	brew install tmux reattach-to-user-namespace
fi
