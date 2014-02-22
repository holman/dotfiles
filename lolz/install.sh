#!/bin/sh

# Fortune cookies
if test ! $(which fortune)
then
  echo "  Installing fortune for you."
  brew install fortune > /tmp/fortune-install.log  
fi
