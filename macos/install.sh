if test ! "$(uname)" = "Darwin"
  then
  return
fi

# The Brewfile handles Homebrew-based app and library installs, but there may
# still be updates and installables in the Mac App Store. there's a nifty
# command line interface to it that we can use to just install everything, so
# yeah, let's do that.

set -e

if [ "$(uname -s)" == "Darwin" ]
then
  echo "› sudo softwareupdate -i -a"
  sudo softwareupdate -i -a
fi

