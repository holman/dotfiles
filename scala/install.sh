#!/bin/sh

if test ! $(which scala)
then
  echo "  Installing scala for you."
  brew install scala > /tmp/scala-install.log
fi

# Fast, faster, fastest compile 4 you. Almost as sbt.
if test ! $(which zinc)
then
  echo "  Installing zinc for you."
  brew install zinc > /tmp/zinc-install.log 2>&1
fi
