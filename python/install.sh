#!/bin/sh

# Check for asdf
if command -v asdf > /dev/null; then
    echo "  Installing Python"
    asdf plugin add python
    asdf install python latest:3
    asdf global python $(asdf latest python 3)
fi


exit 0
