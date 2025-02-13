if test ! "$(uname)" = "Darwin"
  then
  exit 0
fi

# The Brewfile handles Homebrew-based app and library installs, but there may
# still be updates and installables in the Mac App Store. There's a nifty
# command line interface to it that we can use to just install everything, so
# yeah, let's do that.

#echo "› sudo softwareupdate -i -a"
#sudo softwareupdate -i -a
# if you use a separate admin account do `su admin` then:
#sudo softwareupdate -i -a

# setup services
launchctl unload -w $HOME/.dotfiles/macos/com.mine.syncgmail.plist
launchctl load -w $HOME/.dotfiles/macos/com.mine.syncgmail.plist
launchctl unload -w $HOME/.dotfiles/macos/com.mine.homebrewdump.plist
launchctl load -w $HOME/.dotfiles/macos/com.mine.homebrewdump.plist
