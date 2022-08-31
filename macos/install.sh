#!/usr/bin/env bash

if test ! "$(uname)" = "Darwin"
  then
  exit 0
fi

# The Brewfile handles Homebrew-based app and library installs, but there may
# still be updates and installables in the Mac App Store. There's a nifty
# command line interface to it that we can use to just install everything, so
# yeah, let's do that.

echo "› sudo softwareupdate -i -a"
sudo softwareupdate -i -a

# Run all macos defaults
set -e

cd "$(dirname $0)"/..

# find default settings for mac apps and run them iteratively
find . -name "defaults-*.sh" | while read installer ; do sh -c "${installer}" ; done

