#!/bin/bash

echo "setting macos defaults"

# retrieved from https://github.com/thedanfernandez/Automate-MacOS-Setup/blob/master/macos.sh
# retrieved from https://github.com/rusty1s/dotfiles/blob/master/macos/defaults.sh

# Close open System Preferences panes, to prevent them from overriding settings.
osascript -e 'tell application "System Preferences" to quit'

# menu bar
defaults write com.apple.controlcenter BatteryShowPercentage -bool true
defaults write com.apple.controlcenter Sound -int 18
defaults write com.apple.controlcenter Bluetooth -int 18

#defaults write com.apple.dock autohide -bool true       # Autohide dock.
defaults write com.apple.dock tilesize -int 40          # Set dock icon size.
defaults write com.apple.dock magnification -bool true  # Enable dock magnification.
defaults write com.apple.dock largesize -int 60         # Set dock magnificated icon size.
defaults write NSGlobalDomain AppleInterfaceStyle Dark  # Use dark menu bar and dock.
#defaults write com.apple.dock persistent-apps -array    # Delete all apps from dock.
defaults write com.apple.dock show-recents -bool false

killall Dock

# Avoid creating .DS_Store files on network volumes.
defaults write com.apple.desktopservices DSDontWriteNetworkStores -bool true
defaults write com.apple.desktopservices DSDontWriteUSBStores -bool true

# Text correction
defaults write NSGlobalDomain NSAutomaticCapitalizationEnabled -bool false      # Disable automatic capitalization.
defaults write NSGlobalDomain NSAutomaticPeriodSubstitutionEnabled -bool false  # Disable peroid substitution.
defaults write NSGlobalDomain NSAutomaticQuoteSubstitutionEnabled -bool false   # Disable smart quotes.
defaults write NSGlobalDomain NSAutomaticDashSubstitutionEnabled -bool false    # Disable smart dashes.
defaults write NSGlobalDomain NSAutomaticSpellingCorrectionEnabled -bool false  # Disable auto-correct.
defaults write NSGlobalDomain NSAutomaticTextCompletionEnabled -bool false      # Disable text-completion.

# Finder
#defaults write com.apple.finder AppleShowAllFiles -bool true                 # Show hidden files.
#defaults write NSGlobalDomain AppleShowAllExtensions -bool true              # Show all file extensions.
defaults write com.apple.finder FXEnableExtensionsChangeWarning -bool false  # Disable file extension change warning.
defaults write com.apple.finder ShowStatusBar -bool true                     # Show status bar.
defaults write com.apple.finder ShowPathbar -bool true                       # Show path bar.
defaults write com.apple.finder ShowRecentTags -bool false                   # Hide tags in sidebar.
defaults write com.apple.finder QuitMenuItem -bool true                      # Allow quitting finder via ⌘ + Q.
defaults write com.apple.finder SidebarWidth -int 175                        # Greater sidebar width.
defaults write com.apple.finder _FXSortFoldersFirst -bool true               # Keep folders on top when sorting by name
#defaults write com.apple.finder WarnOnEmptyTrash -bool false                 # No warning before emptying trash.

# Set search scope.
# This Mac       : `SCev`
# Current Folder : `SCcf`
# Previous Scope : `SCsp`
defaults write com.apple.finder FXDefaultSearchScope SCcf

# Set preferred view style.
# Icon View   : `icnv`
# List View   : `Nlsv`
# Column View : `clmv`
# Cover Flow  : `Flwv`
defaults write com.apple.finder FXPreferredViewStyle clmv
rm -rf ~/.DS_Store

# Set default path for new windows.
# Computer     : `PfCm`
# Volume       : `PfVo`
# $HOME        : `PfHm`
# Desktop      : `PfDe`
# Documents    : `PfDo`
# All My Files : `PfAF`
# Other…       : `PfLo`
defaults write com.apple.finder NewWindowTarget PfHm

killall Finder

# All screenshots moved to Home/screenshots folder
mkdir -p ~/Screenshots
defaults write com.apple.screencapture location ~/Screenshots

# Show all processes in Activity Monitor
defaults write com.apple.ActivityMonitor ShowCategory -int 0

# Save to disk (not to iCloud) by default
defaults write NSGlobalDomain NSDocumentSaveNewDocumentsToCloud -bool false

# Trackpad: enable tap to click for this user and for the login screen
defaults write com.apple.driver.AppleBluetoothMultitouch.trackpad Clicking -bool true
defaults write com.apple.AppleMultitouchTrackpad Clicking -bool true
defaults -currentHost write NSGlobalDomain com.apple.mouse.tapBehavior -int 1
defaults write NSGlobalDomain com.apple.mouse.tapBehavior -int 1

# Enable snap-to-grid for icons on the desktop and in other icon views
/usr/libexec/PlistBuddy -c "Set :DesktopViewSettings:IconViewSettings:arrangeBy grid" ~/Library/Preferences/com.apple.finder.plist
/usr/libexec/PlistBuddy -c "Set :FK_StandardViewSettings:IconViewSettings:arrangeBy grid" ~/Library/Preferences/com.apple.finder.plist
/usr/libexec/PlistBuddy -c "Set :StandardViewSettings:IconViewSettings:arrangeBy grid" ~/Library/Preferences/com.apple.finder.plist

# Empty Trash securely by default
defaults write com.apple.finder EmptyTrashSecurely -bool true

# Automatically quit printer app once the print jobs complete.
defaults write com.apple.print.PrintingPrefs "Quit When Finished" -bool true

# Prevent Photos from opening automatically when devices are plugged in.
defaults -currentHost write com.apple.ImageCapture disableHotPlug -bool true

# Stop iTunes from responding to the keyboard media keys.
launchctl unload -w /System/Library/LaunchAgents/com.apple.rcd.plist 2> /dev/null

# Set Lock Message to show on login screen
sudo defaults write /Library/Preferences/com.apple.loginwindow LoginwindowText -string "This MacBook is linked to an iCloud account and rendered valueless if lost or stolen. Please return by calling +31 6 82 54 38 24. Reward included."

# Activate all changed settings without logout/login
/System/Library/PrivateFrameworks/SystemAdministration.framework/Resources/activateSettings -u
