if test ! "$(uname)" = "Darwin"
  then
  exit 0
fi

# The Brewfile handles Homebrew-based app and library installs, but there may
# still be updates and installables in the Mac App Store. There's a nifty
# command line interface to it that we can use to just install everything, so
# yeah, let's do that.

echo -n "Would you like to update your macOS software (Apps, patches, etc)? This might take some time. (y/n)? "
read answer
if [ "$answer" != "${answer#[Yy]}" ] ;then
  sudo softwareupdate -i -a
fi
