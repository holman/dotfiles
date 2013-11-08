#!/bin/sh

if test ! $(which gradle)
then
  echo "  Installing gradle for you."
  brew install gradle > /tmp/gradle-install.log
fi
