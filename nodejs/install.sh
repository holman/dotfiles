#!/bin/sh

# Check for Homebrew
if test $(which asdf)
then
    echo "  Installing nodejs"
    asdf install nodejs lts
    asdf global nodejs lts
fi


exit 0
