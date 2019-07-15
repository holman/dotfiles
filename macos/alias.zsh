# open hidden mac apps
alias macos_archive_utility="open /System/Library/CoreServices/Applications/Archive Utility.app"
alias macos_directory_utility="open /System/Library/CoreServices/Applications/Directory Utility.app"
alias macos_screen_sharing_utility="open /System/Library/CoreServices/Applications/Screen Sharing.app"
alias macos_ticket_viewer_utility="open /System/Library/CoreServices/Ticket Viewer.app"

# Kill ARD Locked Screen
alias i_locked_myself_out="ps -ax | grep AppleVNCServer && echo && echo Contents/MacOS/LockScreen && echo sudo_kill_-9_PID"

# Recursively delete `.DS_Store` files
alias cleanup="find . -type f -name '*.DS_Store' -ls -delete"

# Empty the Trash on all mounted volumes and the main HDD.
# Also, clear Apple’s System Logs to improve shell startup speed.
# Finally, clear download history from quarantine. https://mths.be/bum
alias emptytrash="sudo rm -rfv /Volumes/*/.Trashes; sudo rm -rfv ~/.Trash; sudo rm -rfv /private/var/log/asl/*.asl; sqlite3 ~/Library/Preferences/com.apple.LaunchServices.QuarantineEventsV* 'delete from LSQuarantineEvent'"

# Show/hide hidden files in Finder
alias show="defaults write com.apple.finder AppleShowAllFiles -bool true && killall Finder"
alias hide="defaults write com.apple.finder AppleShowAllFiles -bool false && killall Finder"

# Hide/show all desktop icons (useful when presenting)
alias hidedesktop="defaults write com.apple.finder CreateDesktop -bool false && killall Finder"
alias showdesktop="defaults write com.apple.finder CreateDesktop -bool true && killall Finder"

# PlistBuddy alias, because sometimes `defaults` just doesn’t cut it
alias plistbuddy="/usr/libexec/PlistBuddy"
