#!/usr/bin/env bash

# ~/.macos — https://mths.be/macos
# Finding more https://github.com/mathiasbynens/dotfiles/issues/5#issuecomment-4117712

# Run ./defaults-macos.sh and you'll be good to go.

# Close any open System Preferences panes, to prevent them from overriding
# settings we’re about to change
osascript -e 'tell application "System Preferences" to quit'

# Ask for the administrator password upfront
sudo -v

# Keep-alive: update existing `sudo` time stamp until `.macos` has finished
while true; do
  sudo -n true
  sleep 60
  kill -0 "$$" || exit
done 2>/dev/null &

###############################################################################
# DNS Servers - Override default DNS Servers
###############################################################################

# Example: Use Googles DNS as default DNS
# sudo networksetup -setdnsservers Wi-Fi 8.8.8.8 8.8.4.4
sudo networksetup -setdnsservers Wi-Fi 2001:4860:4860::8888 2001:4860:4860::8844

###############################################################################
# General UI/UX                                                               #
###############################################################################

# Enable Dark mode
osascript -e 'tell application "System Events" to tell appearance preferences to set dark mode to true'

# Increase window resize speed for Cocoa applications
defaults write NSGlobalDomain NSWindowResizeTime -float 0.001

# Expand save panel by default
defaults write NSGlobalDomain NSNavPanelExpandedStateForSaveMode -bool true
defaults write NSGlobalDomain NSNavPanelExpandedStateForSaveMode2 -bool true

# Expand print panel by default
defaults write NSGlobalDomain PMPrintingExpandedStateForPrint -bool true
defaults write NSGlobalDomain PMPrintingExpandedStateForPrint2 -bool true

# Automatically quit printer app once the print jobs complete
defaults write com.apple.print.PrintingPrefs "Quit When Finished" -bool true

# Reveal IP address, hostname, OS version, etc. when clicking the clock
# in the login window
sudo defaults write /Library/Preferences/com.apple.loginwindow AdminHostInfo HostName

###############################################################################
# Trackpad, mouse, keyboard, Bluetooth accessories, and input                 #
###############################################################################

# most moved to defaults-macos-keyboard

# Increase sound quality for Bluetooth headphones/headsets
defaults write com.apple.BluetoothAudioAgent "Apple Bitpool Min (editable)" -int 40

##############################################################################
# Security                                                                   #
##############################################################################
# Based on:
# https://github.com/drduh/macOS-Security-and-Privacy-Guide
# https://benchmarks.cisecurity.org/tools2/osx/CIS_Apple_OSX_10.12_Benchmark_v1.0.0.pdf

# Enable firewall. Possible values:
#   0 = off
#   1 = on for specific sevices
#   2 = on for essential services
#sudo defaults write /Library/Preferences/com.apple.alf globalstate -int 1

# Display login window as name and password
#sudo defaults write /Library/Preferences/com.apple.loginwindow SHOWFULLNAME -bool true

# Do not show password hints
sudo defaults write /Library/Preferences/com.apple.loginwindow RetriesUntilHint -int 0

# Disable guest account login
sudo defaults write /Library/Preferences/com.apple.loginwindow GuestEnabled -bool false

# Destroy FileVault key when going into standby mode, forcing a re-auth.
# Source: https://web.archive.org/web/20160114141929/http://training.apple.com/pdf/WP_FileVault2.pdf
sudo pmset destroyfvkeyonstandby 1

###############################################################################
# Finder                                                                      #
###############################################################################

# Require password immediately after sleep or screen saver begins
defaults write com.apple.screensaver askForPassword -int 1
defaults write com.apple.screensaver askForPasswordDelay -int 0

# Show icons for hard drives, servers, and removable media on the desktop
defaults write com.apple.finder ShowExternalHardDrivesOnDesktop -bool true
defaults write com.apple.finder ShowHardDrivesOnDesktop -bool true
defaults write com.apple.finder ShowMountedServersOnDesktop -bool true
defaults write com.apple.finder ShowRemovableMediaOnDesktop -bool true

# Finder: show hidden files by default
defaults write com.apple.finder AppleShowAllFiles -bool true

# Show the ~/Library folder.
chflags nohidden ~/Library

# Finder: show all filename extensions
defaults write NSGlobalDomain AppleShowAllExtensions -bool true

# Finder: show status bar
defaults write com.apple.finder ShowStatusBar -bool true

# Finder: show path bar | at the bottom of window
#defaults write com.apple.finder ShowPathbar -bool true

# Display full POSIX path as Finder window title
defaults write com.apple.finder _FXShowPosixPathInTitle -bool true

# Keep folders on top when sorting by name
defaults write com.apple.finder _FXSortFoldersFirst -bool true

# Disable the warning when changing a file extension
defaults write com.apple.finder FXEnableExtensionChangeWarning -bool false

# Avoid creating .DS_Store files on network or USB volumes
defaults write com.apple.desktopservices DSDontWriteNetworkStores -bool true
defaults write com.apple.desktopservices DSDontWriteUSBStores -bool true

# Show item info near icons on the desktop and in other icon views
/usr/libexec/PlistBuddy -c "Set :DesktopViewSettings:IconViewSettings:showItemInfo true" ~/Library/Preferences/com.apple.finder.plist
/usr/libexec/PlistBuddy -c "Set :StandardViewSettings:IconViewSettings:showItemInfo true" ~/Library/Preferences/com.apple.finder.plist

# Use list view in all Finder windows by default
# Four-letter codes for the other view modes: `icnv`, `clmv`, `Flwv`
defaults write com.apple.finder FXPreferredViewStyle -string "Nlsv"

# Allow Quick look text selection #BROKEN Why Apple Why?
defaults write com.apple.finder QLEnableTextSelection -bool true

# Expand save panel by default
defaults write NSGlobalDomain NSNavPanelExpandedStateForSaveMode -bool true

# Save to disk (not to iCloud) by default
defaults write NSGlobalDomain NSDocumentSaveNewDocumentsToCloud -bool false

# Use AirDrop over every interface. srsly this should be a default.
defaults write com.apple.NetworkBrowser BrowseAllInterfaces 1

###############################################################################
# Dock, Dashboard, and hot corners                                            #
###############################################################################

# Enable highlight hover effect for the grid view of a stack (Dock)
defaults write com.apple.dock mouse-over-hilite-stack -bool true

# Disable Dashboard
defaults write com.apple.dashboard mcx-disabled -bool true

# Don’t show Dashboard as a Space
defaults write com.apple.dock dashboard-in-overlay -bool true

# Speed up Mission Control animations
defaults write com.apple.dock expose-animation-duration -float 0.2

# Automatically hide and show the Dock
defaults write com.apple.dock autohide -bool true

# Make Dock icons of hidden applications translucent
defaults write com.apple.dock showhidden -bool true

# Hot corners
# Possible values:
#  0: no-op
#  2: Mission Control
#  3: Show application windows
#  4: Desktop
#  5: Start screen saver
#  6: Disable screen saver
#  7: Dashboard
# 10: Put display to sleep
# 11: Launchpad
# 12: Notification Center
# Top left screen corner → Mission Control
defaults write com.apple.dock wvous-tl-corner -int 0 # was 2
defaults write com.apple.dock wvous-tl-modifier -int 0
# Top right screen corner → Desktop was 4
defaults write com.apple.dock wvous-tr-corner -int 0 # was 4
defaults write com.apple.dock wvous-tr-modifier -int 0
# Bottom left screen corner → Start screen saver was 5
defaults write com.apple.dock wvous-bl-corner -int 0 # was 5
defaults write com.apple.dock wvous-bl-modifier -int 0

# this is broken now
# # Cusomize Dock Apps
# dockutil --no-restart --remove all;
# # dockutil --no-restart --add "/Applications/Finder.app"; # Added by default
# dockutil --no-restart --add "/Applications/Launchpad.app";
# dockutil --no-restart --add "/Applications/Safari.app";
# dockutil --no-restart --add "/Applications/Firefox.app";
# dockutil --no-restart --add "/Applications/Mail.app";
# dockutil --no-restart --add "/Applications/Contacts.app";
# dockutil --no-restart --add "/Applications/Calendar.app";
# dockutil --no-restart --add "/Applications/Notes.app";
# dockutil --no-restart --add "/Applications/Messages.app";
# dockutil --no-restart --add "/Applications/Facetime.app";
# dockutil --no-restart --add "/Applications/Maps.app";
# dockutil --no-restart --add "/Applications/Photos.app";
# dockutil --no-restart --add "/Applications/Itunes.app";
# dockutil --no-restart --add "/Applications/News.app";
# dockutil --no-restart --add "/Applications/Stocks.app";
# dockutil --no-restart --add "/Applications/Home.app";
# dockutil --no-restart --add "/Applications/App Store.app";
# dockutil --no-restart --add "/Applications/Utilities/Terminal.app";
# dockutil --no-restart --add "/Applications/System Preferences.app";
# dockutil --no-restart --add "/Applications/Utilities/Console.app";
# dockutil --no-restart --add "/Applications/Visual Studio Code.app";

# add a recent item stack
defaults write com.apple.dock persistent-others -array-add '{"tile-data" = {"list-type" = 1;}; "tile-type" = "recents-tile";}'
dockutil --remove Downloads
dockutil --add ~/Downloads/ --view grid --display stack

###############################################################################
# Date & Time                                                                 #
###############################################################################

# Custom DateFormat
defaults write com.apple.menuextra.clock DateFormat "EEE MMM d  h:mm:ss a"
defaults write com.apple.menuextra.clock FlashDateSeparators -bool false

defaults write NSGlobalDomain AppleICUTimeFormatStrings '<dict><key>1</key><string>h:mm:ss a</string></dict>'

###############################################################################
# Activity Monitor                                                            #
###############################################################################

# Show the main window when launching Activity Monitor
defaults write com.apple.ActivityMonitor OpenMainWindow -bool true

# Visualize CPU usage in the Activity Monitor Dock icon
defaults write com.apple.ActivityMonitor IconType -int 5

# Show all processes in Activity Monitor
defaults write com.apple.ActivityMonitor ShowCategory -int 0

# Sort Activity Monitor results by CPU usage
defaults write com.apple.ActivityMonitor SortColumn -string "CPUUsage"
defaults write com.apple.ActivityMonitor SortDirection -int 0

###############################################################################
# Address Book, Dashboard, iCal, TextEdit, Quicktime, and Disk Utility        #
###############################################################################

# Use plain text mode for new TextEdit documents
defaults write com.apple.TextEdit RichText -int 0

# Open and save files as UTF-8 in TextEdit
defaults write com.apple.TextEdit PlainTextEncoding -int 4
defaults write com.apple.TextEdit PlainTextEncodingForWrite -int 4

# Enable the debug menu in Address Book
defaults write com.apple.addressbook ABShowDebugMenu -bool true

# Week should start on Monday
defaults write com.apple.ical "first day of the week" 1

# Auto-play videos when opened with QuickTime Player
defaults write com.apple.QuickTimePlayerX MGPlayMovieOnOpen -bool true

###############################################################################
# Photos                                                                      #
###############################################################################

# Prevent Photos from opening automatically when devices are plugged in
defaults -currentHost write com.apple.ImageCapture disableHotPlug -bool true

###############################################################################
# Time Machine                                                                #
###############################################################################

# Prevent Time Machine from prompting to use new hard drives as backup volume
defaults write com.apple.TimeMachine DoNotOfferNewDisksForBackup -bool true

# Disable local Time Machine backups
#hash tmutil &> /dev/null && sudo tmutil disablelocal

###############################################################################
# Time Machine                                                                #
###############################################################################

# Prevent Time Machine from prompting to use new hard drives as backup volume
defaults write com.apple.TimeMachine DoNotOfferNewDisksForBackup -bool true

# Disable local Time Machine backups
#hash tmutil &> /dev/null && sudo tmutil disablelocal

###############################################################################
# Kill affected applications                                                  #
###############################################################################

sleep 2

for app in "Activity Monitor" "Address Book" "Calendar" "Contacts" "cfprefsd" \
  "Dock" "Finder" "Firefox" "Mail" "Messages" \
  "Photos" "Safari" "Spectacle" "SystemUIServer" \
  "iCal"; do
  killall "${app}" &>/dev/null
done
echo " finished defaults-macos."
