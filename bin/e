#!/bin/sh
#
# Quick shortcut to an editor.
#
# This means that as I travel back and forth between editors, hey, I don't have
# to re-learn any arcane commands. Neat.
#
# USAGE:
#
#   $ e
#   # => opens the current directory in your editor
#
#   $ e .
#   $ e /usr/local
#   # => opens the specified directory in your editor

if [ "$1" == "" ] ; then
  exec $EDITOR .
else
  exec $EDITOR "$1"
fi
