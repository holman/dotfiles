#!/bin/sh

# Check for Homebrew
if test $(which asdf)
then
    echo "  Installing Python"
    asdf install python latest:3
    asdf global python $(asdf latest python 3)
fi


exit 0
