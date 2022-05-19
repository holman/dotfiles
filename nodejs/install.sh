#!/bin/sh

# Check for Homebrew
if command -v asdf > /dev/null;
then
    echo "  Installing nodejs"
    asdf plugin add nodejs
    asdf install nodejs lts
    asdf global nodejs lts
fi


exit 0
