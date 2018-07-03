# The Brewfile handles Homebrew-based app and library installs, but there may
# still be updates and installables in the Mac App Store. There's a nifty
# command line interface to it that we can use to just install everything, so
# yeah, let's do that.

echo "› sudo softwareupdate -i -a"
sudo softwareupdate -i -a


# Stop launching itunes when a bluetooth headset is connected
wget https://s3-us-west-2.amazonaws.com/jguice/mac-bt-headset-fix-beta/bubo.app.zip
unzip bubo.app.zip
rm -f bubo.app.zip
mv bubo.app /Applications/Bubo.app
