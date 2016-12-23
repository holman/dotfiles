#!/bin/sh

if test ! $(which ag)
then
	echo "  Installing ag for you."
	brew install ag
fi
