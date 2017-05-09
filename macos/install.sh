# The Brewfile handles Homebrew-based app and library installs, but there may
# still be updates and installables in the Mac App Store. There's a nifty
# command line interface to it that we can use to just install everything, so
# yeah, let's do that.

# Write some settings

# Reduce Transparency
#defaults write com.apple.universalaccess reduceTransparency -bool true

# Disable Auto Rearrange Spaces Based on Most Recent Use
defaults write com.apple.dock mru-spaces -bool false && killall Dock

# Set plaintext as default for TextEdit
defaults write com.apple.TextEdit RichText -int 0

# Disable Infrared Receiver
defaults write /Library/Preferences/com.apple.driver.AppleIRController DeviceEnabled -int 0

# homebrew
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
brew install tmux
brew cask install calibre firefox textmate tunnelblick
