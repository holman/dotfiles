#!/bin/sh

# Check for Homebrew
if command -v asdf > /dev/null;
then
    echo "  Installing Ruby"
    asdf plugin add ruby
    asdf install ruby latest
    asdf global ruby $(asdf latest ruby)
fi


exit 0
