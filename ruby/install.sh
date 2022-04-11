#!/bin/sh

# Check for Homebrew
if test $(which asdf)
then
    echo "  Installing Ruby"
    asdf install ruby latest
    asdf global ruby $(asdf latest ruby)
fi


exit 0
