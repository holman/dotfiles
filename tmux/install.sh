#!/bin/sh

if test ! $(which tmux)
then
	echo "  Installing tmux and related packages for you."
	brew install tmux
fi
