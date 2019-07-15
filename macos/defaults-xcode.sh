#!/usr/bin/env bash

# Always use spaces for indenting
defaults write com.apple.dt.Xcode DVTTextIndentUsingTabs -bool false

# Show Line Numbers
defaults write com.apple.dt.Xcode DVTTextShowLineNumbers -bool true

# Show page guide
defaults write com.apple.dt.Xcode DVTTextShowPageGuide -bool true

# Show Invisible Characters
defaults write com.apple.dt.Xcode DVTTextShowInvisibleCharacters -bool true

# Show Code Coverage
defaults write com.apple.dt.Xcode DVTTextShowCodeCoverage -bool true

# Show tab bar
defaults write com.apple.dt.Xcode AlwaysShowTabBar -bool true
