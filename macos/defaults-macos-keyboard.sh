#!/usr/bin/env bash

# Set a blazingly fast keyboard repeat rate
# lower is faster
defaults write NSGlobalDomain KeyRepeat -int 2
defaults write NSGlobalDomain InitialKeyRepeat -int 15

# Set mouse and scrolling speed
defaults write NSGlobalDomain com.apple.mouse.scaling -int 1
defaults write NSGlobalDomain com.apple.scrollwheel.scaling -float 0.6875

# Disable press-and-hold for keys in favor of key repeat.
# defaults write -g ApplePressAndHoldEnabled -bool false

# Disable “natural” (Lion-style) scrolling
#defaults write NSGlobalDomain com.apple.swipescrolldirection -bool false


# Can't get this to work :s http://krypted.com/mac-os-x/defaults-symbolichotkeys/
# http://stackoverflow.com/questions/13740337/modifying-a-plist-from-command-line-on-mac-using-defaults
# adding mouse button 3 as show desktop

#defaults write com.apple.symbolichotkeys AppleSymbolicHotKeys -dict-add 42 '<dict><key>enabled</key><true/><key>value</key><dict><key>parameters</key><array><integer>4</integer><integer>4</integer><integer>0</integer></array><key>type</key><string>button</string></dict></dict>'
#defaults write com.apple.symbolichotkeys AppleSymbolicHotKeys -dict-add 43 '<dict><key>enabled</key><true/><key>value</key><dict><key>parameters</key><array><integer>4</integer><integer>4</integer><integer>131072</integer></array><key>type</key><string>button</string></dict></dict>'

#Alternate Format stores everything as a string :s
#defaults write com.apple.symbolichotkeys AppleSymbolicHotKeys -dict-add 42 "{enabled=true;value ={parameters =(4,4,0);type = button;};}"
#defaults write com.apple.symbolichotkeys AppleSymbolicHotKeys -dict-add 43 "{enabled=1;value ={parameters =(4,4,131072);type = 'button';};}"
