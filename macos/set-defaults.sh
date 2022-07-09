# Switch to dark mode
osascript -e 'tell application "System Events" to tell appearance preferences to set dark mode to 1'

# Use AirDrop over every interface. srsly this should be a default.
defaults write com.apple.NetworkBrowser BrowseAllInterfaces 1

# Always open everything in Finder's list view. This is important.
defaults write com.apple.Finder FXPreferredViewStyle Nlsv

# Put the display to sleep if we're in the bottom-left hot corner
defaults write com.apple.dock wvous-bl-corner -int 10
defaults write com.apple.dock wvous-bl-modifier -int 0

# Place the Dock on the left side of the screen
defaults write com.apple.dock orientation left

# Trackpad: enable tap to click for this user and for the login screen
defaults write com.apple.driver.AppleBluetoothMultitouch.trackpad Clicking -bool true
defaults -currentHost write NSGlobalDomain com.apple.mouse.tapBehavior -int 1
defaults write NSGlobalDomain com.apple.mouse.tapBehavior -int 1

# Don't display the annoying prompt when quitting iTerm
defaults write com.googlecode.iterm2 PromptOnQuit -bool false

# Configure iTerm to use preferences in dotfiles directory
defaults write com.googlecode.iterm2 LoadPrefsFromCustomFolder -bool true
defaults write com.googlecode.iterm2 PrefsCustomFolder -string "$HOME/.dotfiles/config/iterm"
defaults write com.googlecode.iterm2 NoSyncNeverRemindPrefsChangesLostForFile_selection -bool false

# Show the ~/Library folder.
chflags nohidden ~/Library
