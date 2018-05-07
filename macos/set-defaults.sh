# Sets reasonable macOS defaults.
#
# Or, in other words, set shit how I like in macOS.
#
# The original idea (and a couple settings) were grabbed from:
#   https://github.com/mathiasbynens/dotfiles/blob/master/.macos
#
# Run ./set-defaults.sh and you'll be good to go.

# Disable press-and-hold for keys in favor of key repeat.
defaults write -g ApplePressAndHoldEnabled -bool false

# Use AirDrop over every interface. srsly this should be a default.
defaults write com.apple.NetworkBrowser BrowseAllInterfaces 1

# Always open everything in Finder's list view. This is important.
defaults write com.apple.Finder FXPreferredViewStyle Nlsv

# Show the ~/Library folder.
chflags nohidden ~/Library

# Set a really fast key repeat.
defaults write NSGlobalDomain KeyRepeat -int 1

# Set the Finder prefs for showing a few different volumes on the Desktop.
defaults write com.apple.finder ShowExternalHardDrivesOnDesktop -bool true
defaults write com.apple.finder ShowRemovableMediaOnDesktop -bool true
defaults write com.apple.finder ShowHardDrivesOnDesktop -bool false

# Set up Safari for development.
defaults write com.apple.Safari IncludeInternalDebugMenu -bool true
defaults write com.apple.Safari IncludeDevelopMenu -bool true
defaults write com.apple.Safari WebKitDeveloperExtrasEnabledPreferenceKey -bool true
defaults write com.apple.Safari "com.apple.Safari.ContentPageGroupIdentifier.WebKit2DeveloperExtrasEnabled" -bool true
defaults write NSGlobalDomain WebKitDeveloperExtras -bool true

# Save screenshots to a specified directory
mkdir ~/Pictures/Screenshots
defaults write com.apple.screencapture location ~/Pictures/Screenshots

# Stop spaces from rearranging based on last use
defaults write com.apple.dock mru-spaces -bool false

# Autohide the dock
defaults write com.apple.dock autohide -bool true

# Set up mouse and trackpad default
defaults write com.apple.AppleMultitouchMouse MouseButtonMode "TwoButton"
defaults write com.apple.AppleMultitouchMouse MouseOneFingerDoubleTapGesture 0
defaults write com.apple.AppleMultitouchMouse MouseTwoFingerDoubleTapGesture 3
defaults write com.apple.AppleMultitouchMouse MouseTwoFingerHorizSwipeGesture 2
defaults write com.apple.AppleMultitouchTrackpad Clicking 0
defaults write com.apple.AppleMultitouchTrackpad DragLock 0
defaults write com.apple.AppleMultitouchTrackpad Dragging 0
defaults write com.apple.AppleMultitouchTrackpad TrackpadCornerSecondaryClick 2
defaults write com.apple.AppleMultitouchTrackpad TrackpadFiveFingerPinchGesture 2
defaults write com.apple.AppleMultitouchTrackpad TrackpadFourFingerHorizSwipeGesture 2
defaults write com.apple.AppleMultitouchTrackpad TrackpadFourFingerPinchGesture 2
defaults write com.apple.AppleMultitouchTrackpad TrackpadFourFingerVertSwipeGesture 2
defaults write com.apple.AppleMultitouchTrackpad TrackpadRightClick 0
defaults write com.apple.AppleMultitouchTrackpad TrackpadThreeFingerDrag 0

# Touchbar controlstrip
defaults write com.apple.controlstrip MiniCustomized '(com.apple.system.brightness, com.apple.system.media-play-pause, com.apple.system.volume, com.apple.system.mute, com.apple.system.screen-lock)'
defaults write com.apple.controlstrip FullCustomized '(com.apple.system.group.brightness, com.apple.system.mission-control, com.apple.system.group.keyboard-brightness, com.apple.system.group.media, com.apple.system.group.volume, com.apple.system.screen-lock)'

# Remove iTunes helper so it stops catching media keys
osascript -e 'tell application "System Events" to delete login item "ituneshelper"'

# iStat Menubars
defaults write com.bjango.istatmenus6.extras StatusItems-Order '(7, 9, 1, 2, 3, 4, 5, 6)'
defaults write com.bjango.istatmenus6.extras Time_Cities '({city = "New York City";"city_plain" = "";country = "United States";identifier = 5128581;latitude = "40.71427";longitude = "-74.00597";population = 8175133;state = "New York";timezone = "America/New_York";},{city = London;"city_plain" = "";country = "United Kingdom";identifier = 2643743;latitude = "51.50853";longitude = "-0.12574";population = 7556900;state = England;timezone = "Europe/London";},{city = "San Francisco";"city_plain" = "";country = "United States";identifier = 5391959;latitude = "37.77493";longitude = "-122.41942";population = 864816;state = California;timezone = "America/Los_Angeles";})'
defaults write.com.bjango.istatmenus6.extras Time_MenubarFormat '({format =             (("___ICON__TRANSPARENT___",FUZZY),());lines = 1;})'
