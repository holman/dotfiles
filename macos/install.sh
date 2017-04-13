# The Brewfile handles Homebrew-based app and library installs, but there may
# still be updates and installables in the Mac App Store. There's a nifty
# command line interface to it that we can use to just install everything, so
# yeah, let's do that.

# Reduce Transparency
defaults write com.apple.universalaccess reduceTransparency -bool true

# set plaintext as default for TextEdit
defaults write com.apple.TextEdit RichText -int 0

# set wallpaper
#sqlite3 ~/Library/Application\ Support/Dock/desktoppicture.db "update data set value = '/path/to/picture.jpg'" && killall Dock

# uninstall google updater
#~/Library/Google/GoogleSoftwareUpdate/GoogleSoftwareUpdate.bundle/Contents/Resources/ksinstall --nuke

# show mail attachments as icons:
#defaults write com.apple.mail DisableInlineAttachmentViewing -bool yes

# this enabled develop menu and web inspector, which I don't
# care about, but it's an idea for syncing safari settings
# defaults write com.apple.Safari IncludeInternalDebugMenu -bool true && \
# defaults write com.apple.Safari IncludeDevelopMenu -bool true && \
# defaults write com.apple.Safari WebKitDeveloperExtrasEnabledPreferenceKey -bool true && \
# defaults write com.apple.Safari com.apple.Safari.ContentPageGroupIdentifier.WebKit2DeveloperExtrasEnabled -bool true && \
# defaults write -g WebKitDeveloperExtras -bool true

# set whether Time Machine performs local backups while the Time Machine backup volume is not available.

# Status
#defaults read /Library/Preferences/com.apple.TimeMachine MobileBackups

# Enable (Default)
#sudo tmutil enablelocal

# Disable
#sudo tmutil disablelocal



#Compiling MacVim via Homebrew with all bells and whistles, including overriding system Vim.

#brew install macvim --HEAD --with-cscope --with-lua --with-override-system-vim --with-luajit --with-python

# Install Command Line Tools without Xcode

# xcode-select --install




#Awesome OS X Command Line

 #   A curated list of shell commands and tools specific to OS X.

#Appearance
#Transparency
#Transparency in Menu and Windows

# Reduce Transparency
defaults write com.apple.universalaccess reduceTransparency -bool true

# Restore Default Transparency
#defaults write com.apple.universalaccess reduceTransparency -bool false

#Wallpaper
#Set Wallpaper
sqlite3 ~/Library/Application\ Support/Dock/desktoppicture.db "update data set value = '/path/to/picture.jpg'" && killall Dock

#Applications
#App Store
#List All Apps Downloaded from App Store

# Via find
#find /Applications -path '*Contents/_MASReceipt/receipt' -maxdepth 4 -print |\sed 's#.app/Contents/_MASReceipt/receipt#.app#g; s#/Applications/##'

# Via Spotlight
#mdfind kMDItemAppStoreHasReceipt=1

#Show Debug Menu

# Enable
#defaults write com.apple.appstore ShowDebugMenu -bool true
# Disable (Default)
#defaults write com.apple.appstore ShowDebugMenu -bool false

#Apple Remote Desktop
#Remove Apple Remote Desktop Settings

sudo rm -rf /var/db/RemoteManagement ; \
sudo defaults delete /Library/Preferences/com.apple.RemoteDesktop.plist ; \
defaults delete ~/Library/Preferences/com.apple.RemoteDesktop.plist ; \
sudo rm -r /Library/Application\ Support/Apple/Remote\ Desktop/ ; \
rm -r ~/Library/Application\ Support/Remote\ Desktop/ ; \
rm -r ~/Library/Containers/com.apple.RemoteDesktop

#Contacts

# Debug Mode
#defaults write com.apple.addressbook ABShowDebugMenu -bool true

#Google
#Uninstall Google Update

#~/Library/Google/GoogleSoftwareUpdate/GoogleSoftwareUpdate.bundle/Contents/Resources/ksinstall --nuke

#Mail
#Show Attachments as Icons
defaults write com.apple.mail DisableInlineAttachmentViewing -bool yes

#Vacuum Mail Index

#The AppleScript code below will quit Mail, vacuum the SQLite index, then re-open Mail. On a large email database that hasn't been optimized for a while, this can provide significant improvements in responsiveness and speed.

#(*
#Speed up Mail.app by vacuuming the Envelope Index
#Code from: http://web.archive.org/web/20071008123746/http://www.hawkwings.net/2007/03/03/scripts-to-automate-the-mailapp-envelope-speed-trick/
#Originally by "pmbuko" with modifications by Romulo
#Updated by Brett Terpstra 2012
#Updated by Mathias Törnblom 2015 to support V3 in El Capitan and still keep backwards compatibility
#Updated by Andrei Miclaus 2017 to support V4 in Sierra
#*)

tell application "Mail" to quit
set os_version to do shell script "sw_vers -productVersion"
set mail_version to "V2"
considering numeric strings
    if "10.10" <= os_version then set mail_version to "V3"
    if "10.12" < os_version then set mail_version to "V4"
end considering

set sizeBefore to do shell script "ls -lnah ~/Library/Mail/" & mail_version & "/MailData | grep -E 'Envelope Index$' | awk {'print $5'}"
do shell script "/usr/bin/sqlite3 ~/Library/Mail/" & mail_version & "/MailData/Envelope\\ Index vacuum"

set sizeAfter to do shell script "ls -lnah ~/Library/Mail/" & mail_version & "/MailData | grep -E 'Envelope Index$' | awk {'print $5'}"

display dialog ("Mail index before: " & sizeBefore & return & "Mail index after: " & sizeAfter & return & return & "Enjoy the new speed!")

tell application "Mail" to activate

#Safari
#Enable Develop Menu and Web Inspector

defaults write com.apple.Safari IncludeInternalDebugMenu -bool true && \
defaults write com.apple.Safari IncludeDevelopMenu -bool true && \
defaults write com.apple.Safari WebKitDeveloperExtrasEnabledPreferenceKey -bool true && \
defaults write com.apple.Safari com.apple.Safari.ContentPageGroupIdentifier.WebKit2DeveloperExtrasEnabled -bool true && \
defaults write -g WebKitDeveloperExtras -bool true

#Get Current Page Data

#Other options: get source, get text.

osascript -e 'tell application "Safari" to get URL of current tab of front window'

#TextEdit
#Use Plain Text Mode as Default
defaults write com.apple.TextEdit RichText -int 0

#Backup
#Time Machine
#Change Backup Interval

#This changes the interval to 30 minutes. The integer value is the time in seconds.
sudo defaults write /System/Library/LaunchDaemons/com.apple.backupd-auto StartInterval -int 1800

#Local Backups

#Whether Time Machine performs local backups while the Time Machine backup volume is not available.

# Status
defaults read /Library/Preferences/com.apple.TimeMachine MobileBackups

# Enable (Default)
sudo tmutil enablelocal

# Disable
sudo tmutil disablelocal

Prevent Time Machine from Prompting to Use New Hard Drives as Backup Volume

sudo defaults write /Library/Preferences/com.apple.TimeMachine DoNotOfferNewDisksForBackup -bool true

#Verify Backup

#Beginning in OS X 10.11, Time Machine records checksums of files copied into snapshots. Checksums are not retroactively computed for files that were copied by earlier releases of OS X.

sudo tmutil verifychecksums /path/to/backup

#Developer
#Vim
#Compile Sane Vim

#Compiling MacVim via Homebrew with all bells and whistles, including overriding system Vim.

brew install macvim --HEAD --with-cscope --with-lua --with-override-system-vim --with-luajit --with-python

#Neovim

Install the development version of this modern Vim drop-in alternative via Homebrew.

brew install neovim/neovim/neovim

Xcode
Install Command Line Tools without Xcode

xcode-select --install

Remove All Unavailable Simulators

xcrun simctl delete unavailable

#Dock

# Disable Auto Rearrange Spaces Based on Most Recent Use
defaults write com.apple.dock mru-spaces -bool false && \
killall Dock

#Icon Bounce
#Global setting whether Dock icons should bounce when the respective application demands your attention.
# Disable
# defaults write com.apple.dock no-bouncing -bool false && \
# killall Dock

#Reset Dock

#defaults delete com.apple.dock && \
#killall Dock

#Resize

#Fully resize your Dock's body. To resize change the 0 value as an integer.

defaults write com.apple.dock tilesize -int 0 && \
killall Dock

#Scroll Gestures

#Use your touchpad or mouse scroll wheel to interact with Dock items. Allows you to use an upward scrolling gesture to open stacks. Using the same gesture on applications that are running invokes Exposé/Mission Control.

# Enable
defaults write com.apple.dock scroll-to-open -bool true && \
killall Dock

# Disable (Default)
defaults write com.apple.dock scroll-to-open -bool false && \
killall Dock

#Set Auto Show/Hide Delay

#The float number defines the show/hide delay in ms.

defaults write com.apple.Dock autohide-delay -float 0 && \
killall Dock

#Show Hidden App Icons

# Enable
defaults write com.apple.dock showhidden -bool true && \
killall Dock

# Disable (Default)
defaults write com.apple.dock showhidden -bool false && \
killall Dock

#Disable Sudden Motion Sensor
#Leaving this turned on is useless when you're using SSDs.
sudo pmset -a sms 0

#Disable Disk Image Verification

defaults write com.apple.frameworks.diskimages skip-verify -bool true && \
defaults write com.apple.frameworks.diskimages skip-verify-locked -bool true && \
defaults write com.apple.frameworks.diskimages skip-verify-remote -bool true

Make Volume OS X Bootable

bless --folder "/path/to/mounted/volume/System/Library/CoreServices" --bootinfo --bootefi

Mount Disk Image

hdiutil attach /path/to/diskimage.dmg

Unmount Disk Image

hdiutil detach /dev/disk2s1

Write Disk Image to Volume

Like the Disk Utility "Restore" function.

sudo asr -restore -noverify -source /path/to/diskimage.dmg -target /Volumes/VolumeToRestoreTo

Documents
Convert File to HTML

Supported formats are plain text, rich text (rtf) and Microsoft Word (doc/docx).

textutil -convert html file.ext

Finder
Files and Folders
Clear All ACLs

sudo chmod -RN /path/to/folder

Hide Folder in Finder

chflags hidden /path/to/folder/

Show All File Extensions

defaults write -g AppleShowAllExtensions -bool true

Show Hidden Files

# Show All
defaults write com.apple.finder AppleShowAllFiles true

# Restore Default File Visibility
defaults write com.apple.finder AppleShowAllFiles false

Remove Protected Flag

sudo chflags -R nouchg /path/to/file/or/folder

Show Full Path in Finder Title

defaults write com.apple.finder _FXShowPosixPathInTitle -bool true

Unhide User Library Folder

chflags nohidden ~/Library

Increase Number of Recent Places

defaults write -g NSNavRecentPlacesLimit -int 10 && \
killall Finder

Layout
Show "Quit Finder" Menu Item

Makes possible to see Finder menu item "Quit Finder" with default shortcut Cmd + Q

# Enable
defaults write com.apple.finder QuitMenuItem -bool true && \
killall Finder

# Disable (Default)
defaults write com.apple.finder QuitMenuItem -bool false && \
killall Finder

Smooth Scrolling

Useful if you’re on an older Mac that messes up the animation.

# Disable
defaults write -g NSScrollAnimationEnabled -bool false

# Enable (Default)
defaults write -g NSScrollAnimationEnabled -bool true

Rubberband Scrolling

# Disable
defaults write -g NSScrollViewRubberbanding -bool false

# Enable (Default)
defaults write -g NSScrollViewRubberbanding -bool true

Expand Save Panel by Default

defaults write -g NSNavPanelExpandedStateForSaveMode -bool true && \
defaults write -g NSNavPanelExpandedStateForSaveMode2 -bool true

Desktop Icon Visibility

# Hide Icons
defaults write com.apple.finder CreateDesktop -bool false && \
killall Finder

# Show Icons (Default)
defaults write com.apple.finder CreateDesktop -bool true && \
killall Finder

Path Bar

# Show
defaults write com.apple.finder ShowPathbar -bool true

# Hide (Default)
defaults write com.apple.finder ShowPathbar -bool false

Scrollbar Visibility

Possible values: WhenScrolling, Automatic and Always.

defaults write -g AppleShowScrollBars -string "Always"

Status Bar

# Show
defaults write com.apple.finder ShowStatusBar -bool true

# Hide (Default)
defaults write com.apple.finder ShowStatusBar -bool false

Save to Disk by Default

Sets default save target to be a local disk, not iCloud.

defaults write -g NSDocumentSaveNewDocumentsToCloud -bool false

Set Current Folder as Default Search Scope

defaults write com.apple.finder FXDefaultSearchScope -string "SCcf"

Set Default Finder Location to Home Folder

defaults write com.apple.finder NewWindowTarget -string "PfLo" && \
defaults write com.apple.finder NewWindowTargetPath -string "file://${HOME}"

Set Sidebar Icon Size

Sets size to 'medium'.

defaults write -g NSTableViewDefaultSizeMode -int 2

Metadata Files
Disable Creation of Metadata Files on Network Volumes

Avoids creation of .DS_Store and AppleDouble files.

defaults write com.apple.desktopservices DSDontWriteNetworkStores -bool true

Disable Creation of Metadata Files on USB Volumes

Avoids creation of .DS_Store and AppleDouble files.

defaults write com.apple.desktopservices DSDontWriteUSBStores -bool true

Opening Things
Change Working Directory to Finder Path

If multiple windows are open, it chooses the top-most one.

cd "$(osascript -e 'tell app "Finder" to POSIX path of (insertion location as alias)')"

Open URL

open https://github.com

Open File

open README.md

Open Applications

You can open applications using -a.

open -a "Google Chrome" https://github.com

Open Folder

open /path/to/folder/

Open Current Folder

open .

Fonts
Clear Font Cache for Current User

To clear font caches for all users, put sudo in front of this command.

atsutil databases -removeUser && \
atsutil server -shutdown && \
atsutil server -ping

Get SF Mono Fonts

You need to download and install Xcode 8 beta for this to work. Afterwards they should be available in all applications.

cp -v /Applications/Xcode-beta.app/Contents/SharedFrameworks/DVTKit.framework/Versions/A/Resources/Fonts/SFMono-* ~/Library/Fonts

From Sierra onward, they are included in Terminal.app.

cp -v /Applications/Utilities/Terminal.app/Contents/Resources/Fonts/SFMono-* ~/Library/Fonts

Functions

Please see this file.
Hardware
Bluetooth

# Status
defaults read /Library/Preferences/com.apple.Bluetooth ControllerPowerState

# Enable (Default)
sudo defaults write /Library/Preferences/com.apple.Bluetooth ControllerPowerState -int 1

# Disable
sudo defaults write /Library/Preferences/com.apple.Bluetooth ControllerPowerState -int 0 && \
sudo killall -HUP blued

#Hardware Information
#List All Hardware Ports

networksetup -listallhardwareports

#Remaining Battery Percentage

pmset -g batt | egrep "([0-9]+\%).*" -o --colour=auto | cut -f1 -d';'

#Remaining Battery Time

pmset -g batt | egrep "([0-9]+\%).*" -o --colour=auto | cut -f3 -d';'

#Show Connected Device's UDID

system_profiler SPUSBDataType | sed -n -e '/iPad/,/Serial/p' -e '/iPhone/,/Serial/p'

#Show Current Screen Resolution
system_profiler SPDisplaysDataType | grep Resolution

#Show CPU Brand String
sysctl -n machdep.cpu.brand_string

#Infrared Receiver

# Status
defaults read /Library/Preferences/com.apple.driver.AppleIRController DeviceEnabled

# Enable (Default)
defaults write /Library/Preferences/com.apple.driver.AppleIRController DeviceEnabled -int 1

# Disable
defaults write /Library/Preferences/com.apple.driver.AppleIRController DeviceEnabled -int 0

#Power Management
#Prevent System Sleep

#Prevent sleep for 1 hour:

caffeinate -u -t 3600

#Show All Power Management Settings

sudo pmset -g

#Put Display to Sleep after 15 Minutes of Inactivity

sudo pmset displaysleep 15

Put Computer to Sleep after 30 Minutes of Inactivity

sudo pmset sleep 30

Check System Sleep Idle Time

sudo systemsetup -getcomputersleep

Set System Sleep Idle Time to 60 Minutes

sudo systemsetup -setcomputersleep 60

Turn Off System Sleep Completely

sudo systemsetup -setcomputersleep Never

Automatic Restart on System Freeze

sudo systemsetup -setrestartfreeze on

Chime When Charging

Play iOS charging sound when MagSafe is connected.

# Enable
defaults write com.apple.PowerChime ChimeOnAllHardware -bool true && \
open /System/Library/CoreServices/PowerChime.app

# Disable (Default)
defaults write com.apple.PowerChime ChimeOnAllHardware -bool false && \
killall PowerChime

Input Devices
Keyboard
Auto-Correct

# Disable
defaults write -g NSAutomaticSpellingCorrectionEnabled -bool false

# Enable (Default)
defaults write -g NSAutomaticSpellingCorrectionEnabled -bool true

# Show Status
defaults read -g NSAutomaticSpellingCorrectionEnabled

Full Keyboard Access

Enable Tab in modal dialogs.

# Text boxes and lists only (Default)
defaults write NSGlobalDomain AppleKeyboardUIMode -int 0

# All controls
defaults write NSGlobalDomain AppleKeyboardUIMode -int 3

Key Repeat

Disable the default "press and hold" behavior.

# Enable Key Repeat
defaults write -g ApplePressAndHoldEnabled -bool false

# Disable Key Repeat
defaults write -g ApplePressAndHoldEnabled -bool true

Key Repeat Rate

Sets a very fast repeat rate, adjust to taste.

defaults write -g KeyRepeat -int 0.02

Media
Audio
Convert Audio File to iPhone Ringtone

afconvert input.mp3 ringtone.m4r -f m4af

Create Audiobook From Text

Uses "Alex" voice, a plain UTF-8 encoded text file for input and AAC output.

say -v Alex -f file.txt -o "output.m4a"

Disable Sound Effects on Boot

sudo nvram SystemAudioVolume=" "

Mute Audio Output

osascript -e 'set volume output muted true'

Set Audio Volume

osascript -e 'set volume 4'

Play Audio File

You can play all audio formats that are natively supported by QuickTime.

afplay -q 1 filename.mp3

Speak Text with System Default Voice

say 'All your base are belong to us!'

Video
Auto-Play Videos in QuickTime Player

defaults write com.apple.QuickTimePlayerX MGPlayMovieOnOpen 1

Networking
Bonjour
Bonjour Service

# Disable
sudo defaults write /System/Library/LaunchDaemons/com.apple.mDNSResponder.plist ProgramArguments -array-add "-NoMulticastAdvertisements"

# Enable (Default)
sudo defaults write /System/Library/LaunchDaemons/com.apple.mDNSResponder.plist ProgramArguments -array "/usr/sbin/mDNSResponder" "-launchd"

DHCP
Renew DHCP Lease

sudo ipconfig set en0 DHCP

Show DHCP Info

ipconfig getpacket en0

DNS
Clear DNS Cache

sudo dscacheutil -flushcache && \
sudo killall -HUP mDNSResponder

Hostname
Set Computer Name/Host Name

sudo scutil --set ComputerName "newhostname" && \
sudo scutil --set HostName "newhostname" && \
sudo scutil --set LocalHostName "newhostname" && \
sudo defaults write /Library/Preferences/SystemConfiguration/com.apple.smb.server NetBIOSName -string "newhostname"

Network Preferences
Network Locations

Switch between network locations created in the Network preference pane.

# Status
scselect

# Switch Network Location
scselect LocationNameFromStatus

Networking Tools
Ping a Host to See Whether It’s Available

ping -o github.com

Troubleshoot Routing Problems

traceroute github.com

SSH
Remote Login

# Enable remote login
sudo launchctl load -w /System/Library/LaunchDaemons/ssh.plist

# Disable remote login
sudo launchctl unload -w /System/Library/LaunchDaemons/ssh.plist

TCP/IP
Show Application Using a Certain Port

This outputs all applications currently using port 80.

sudo lsof -i :80

Show External IP Address

dig +short myip.opendns.com @resolver1.opendns.com

TFTP
Start Native TFTP Daemon

Files will be served from /private/tftpboot.

sudo launchctl load -F /System/Library/LaunchDaemons/tftp.plist && \
sudo launchctl start com.apple.tftpd

Wi-Fi
Join a Wi-Fi Network

networksetup -setairportnetwork en0 WIFI_SSID WIFI_PASSWORD

Scan Available Access Points

Create a symbolic link to the airport command for easy access:

sudo ln -s /System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport /usr/local/bin/airport

Run a wireless scan:

airport -s

Show Current SSID

/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport -I | awk '/ SSID/ {print substr($0, index($0, $2))}'

Show Local IP Address

ipconfig getifaddr en0

Show Wi-Fi Connection History

defaults read /Library/Preferences/SystemConfiguration/com.apple.airport.preferences | grep LastConnected -A 7

Show Wi-Fi Network Passwords

Exchange SSID with the SSID of the access point you wish to query the password from.

security find-generic-password -D "AirPort network password" -a "SSID" -gw

Turn on Wi-Fi Adapter

networksetup -setairportpower en0 on

Package Managers

    Fink - The full world of Unix Open Source software for Darwin. A little outdated.
    Homebrew - The missing package manager for OS X. The most popular choice.
    MacPorts - Compile, install and upgrade either command-line, X11 or Aqua based open-source software. Very clean, it's what I use.

#Printing
#Clear Print Queue
cancel -a -

#Expand Print Panel by Default

defaults write -g PMPrintingExpandedStateForPrint -bool true && \
defaults write -g PMPrintingExpandedStateForPrint2 -bool true

#Quit Printer App After Print Jobs Complete

defaults write com.apple.print.PrintingPrefs "Quit When Finished" -bool true

Security
Application Firewall
Firewall Service

# Show Status
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate

# Enable
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --setglobalstate on

# Disable (Default)
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --setglobalstate off

Add Application to Firewall

sudo /usr/libexec/ApplicationFirewall/socketfilterfw --add /path/to/file

Gatekeeper
Add Gatekeeper Exception

spctl --add /path/to/Application.app

Remove Gatekeeper Exception

spctl --remove /path/to/Application.app

Manage Gatekeeper

# Status
spctl --status

# Enable (Default)
sudo spctl --master-enable

# Disable
sudo spctl --master-disable

Passwords
Generate Secure Password and Copy to Clipboard

LC_ALL=C tr -dc "[:alpha:][:alnum:]" < /dev/urandom | head -c 20 | pbcopy

Physical Access
Launch Screen Saver

open /System/Library/Frameworks/ScreenSaver.framework/Versions/A/Resources/ScreenSaverEngine.app

#Lock Screen

/System/Library/CoreServices/Menu\ Extras/User.menu/Contents/Resources/CGSession -suspend

#Screensaver Immediate Lock

# Status
defaults read com.apple.screensaver askForPasswordDelay

# Enable (Default)
defaults write com.apple.screensaver askForPasswordDelay -int 0

# Disable (Integer = lock delay in seconds)
defaults write com.apple.screensaver askForPasswordDelay -int 10

Screensaver Password

# Status
defaults read com.apple.screensaver askForPassword

# Enable
defaults write com.apple.screensaver askForPassword -int 1

# Disable (Default)
defaults write com.apple.screensaver askForPassword -int 0

Search
Find
Recursively Delete .DS_Store Files

find . -type f -name '*.DS_Store' -ls -delete

Locate
Build Locate Database

sudo launchctl load -w /System/Library/LaunchDaemons/com.apple.locate.plist

Search via Locate

The -i modifier makes the search case insensitive.

locate -i *.jpg

# System
#	AirDrop

# Enable AirDrop over Ethernet and on Unsupported Macs
defaults write com.apple.NetworkBrowser BrowseAllInterfaces -bool true

# Enable (Default)
defaults remove com.apple.NetworkBrowser DisableAirDrop

# Disable
defaults write com.apple.NetworkBrowser DisableAirDrop -bool YES

AppleScript
Execute AppleScript

osascript /path/to/script.scpt

Basics
Compare Two Folders

diff -qr /path/to/folder1 /path/to/folder2

#Copy Large File with Progress

# Make sure you have pv installed and replace 
# /dev/rdisk2 with the appropriate write device or file.

FILE=/path/to/file.iso pv -s $(du -h $FILE | awk '/.*/ {print $1}') $FILE | sudo dd of=/dev/rdisk2 bs=1m

#Restore Sane Shell

#In case your shell session went insane (some script or application turned it into a garbled mess).

stty sane

Show Build Number of OS

sw_vers

Uptime

How long since your last restart.

uptime

Clipboard
Copy data to Clipboard

cat whatever.txt | pbcopy

Convert Clipboard to Plain Text

pbpaste | textutil -convert txt -stdin -stdout -encoding 30 | pbcopy

Convert Tabs to Spaces for Clipboard Content

pbpaste | expand | pbcopy

Copy data from Clipboard

pbpaste > whatever.txt

#Sort and Strip Duplicate Lines from Clipboard Content

pbpaste | sort | uniq | pbcopy

#FileVault
#Automatically Unlock FileVault on Restart

#If FileVault is enabled on the current volume, it restarts the system, bypassing the initial unlock. The command may not work on all systems.

sudo fdesetup authrestart

FileVault Service

# Status
sudo fdesetup status

# Enable
sudo fdesetup enable

# Disable (Default)
sudo fdestatus disable

Information/Reports
Generate Advanced System and Performance Report

sudo sysdiagnose -f ~/Desktop/

Install OS
Create Bootable Installer

# Mavericks
sudo /Applications/Install\ OS\ X\ Mavericks.app/Contents/Resources/createinstallmedia --volume /Volumes/MyVolume --applicationpath /Applications/Install\ OS\ X\ Mavericks.app

#Kernel Extensions
#Display Status of Loaded Kernel Extensions

sudo kextstat -l

Load Kernel Extension

sudo kextload -b com.apple.driver.ExampleBundle

Unload Kernel Extensions

sudo kextunload -b com.apple.driver.ExampleBundle

LaunchAgents

Please see this file.
LaunchServices
Rebuild LaunchServices Database

To be independent of OS X version, this relies on locate to find lsregister. If you do not have your locate database built yet, do it.

sudo $(locate lsregister) -kill -seed -r

Login Window
Set Login Window Text

sudo defaults write /Library/Preferences/com.apple.loginwindow LoginwindowText "Your text"

Memory Management
Purge memory cache

sudo purge

#Notification Center
#Notification Center Service

# Disable
launchctl unload -w /System/Library/LaunchAgents/com.apple.notificationcenterui.plist && \
killall -9 NotificationCenter

# Enable (Default)
launchctl load -w /System/Library/LaunchAgents/com.apple.notificationcenterui.plist

QuickLook
Preview via QuickLook

qlmanage -p /path/to/file

Remote Apple Events

# Status
sudo systemsetup -getremoteappleevents

# Enable
sudo systemsetup -setremoteappleevents on

# Disable (Default)
sudo systemsetup -setremoteappleevents off

Root User

# Enable
dsenableroot

# Disable
dsenableroot -d

Safe Mode Boot

# Status
nvram boot-args

# Enable
sudo nvram boot-args="-x"

# Disable
sudo nvram boot-args=""

Screenshots
Take Delayed Screenshot

Takes a screenshot as JPEG after 3 seconds and displays in Preview.

screencapture -T 3 -t jpg -P delayedpic.jpg

Save Screenshots to Given Location

Sets location to ~/Desktop.

defaults write com.apple.screencapture location ~/Desktop && \
killall SystemUIServer

#Save Screenshots in Given Format

Sets format to png. Other options are bmp, gif, jpg, jpeg, pdf, tiff.

defaults write com.apple.screencapture type -string "png"

Disable Shadow in Screenshots

defaults write com.apple.screencapture disable-shadow -bool true && \
killall SystemUIServer

Set Default Screenshot Name

Date and time remain unchanged.

defaults write com.apple.screencapture name "Example name" && \
killall SystemUIServer

#Software Installation
#Install PKG

installer -pkg /path/to/installer.pkg -target /

#Software Update
#Install All Available Software Updates
#sudo softwareupdate -ia

Set Software Update Check Interval

#Set to check daily instead of weekly.
defaults write com.apple.SoftwareUpdate ScheduleFrequency -int 1

#Show Available Software Updates
#sudo softwareupdate -l

#Spotlight
#Spotlight Indexing

# Disable
mdutil -i off -d /path/to/volume

# Enable (Default)
mdutil -i on /path/to/volume

Erase Spotlight Index and Rebuild

mdutil -E /path/to/volume

Search via Spotlight

mdfind -name 'searchterm'

Show Spotlight Indexed Metadata

mdls /path/to/file

System Integrity Protection
Disable System Integrity Protection

Reboot while holding Cmd + R, open the Terminal application and enter:

csrutil disable && reboot

Enable System Integrity Protection

Reboot while holding Cmd + R, open the Terminal application and enter:

csrutil enable && reboot

Date and Time
List Available Timezones

sudo systemsetup -listtimezones

Set Timezone

sudo systemsetup -settimezone Europe/Berlin

Set Clock Using Network Time

# Status
sudo systemsetup getusingnetworktime

# Enable (Default)
sudo systemsetup setusingnetworktime on

# Disable
sudo systemsetup setusingnetworktime off

Terminal
Ring Terminal Bell

Rings the terminal bell (if enabled) and puts a badge on it.

tput bel

Alternative Terminals

    iTerm2 - A better Terminal.app.

Shells
Bash

Install the latest version and set as current users' default shell:

brew install bash && \
echo $(brew --prefix)/bin/bash | sudo tee -a /etc/shells && \
chsh -s $(brew --prefix)/bin/bash

    Homepage - The default shell for OS X and most other Unix-based operating systems.
    Bash-it - Community Bash framework, like Oh My Zsh for Bash.

fish

Install the latest version and set as current users' default shell:

brew install fish && \
echo $(brew --prefix)/bin/fish | sudo tee -a /etc/shells && \
chsh -s $(brew --prefix)/bin/fish

    Homepage - A smart and user-friendly command line shell for OS X, Linux, and the rest of the family.
    Fisherman - A blazing fast, modern plugin manager for Fish.
    The Fishshell Framework - Provides core infrastructure to allow you to install packages which extend or modify the look of your shell.
    Installation & Configuration Tutorial - How to Setup Fish Shell with Fisherman, Powerline Fonts, iTerm2 and Budspencer Theme on OS X.

Zsh

Install the latest version and set as current users' default shell:

brew install zsh && \
sudo sh -c 'echo $(brew --prefix)/bin/zsh >> /etc/shells' && \
chsh -s $(brew --prefix)/bin/zsh

    Homepage - Zsh is a shell designed for interactive use, although it is also a powerful scripting language.
    Oh My Zsh - An open source, community-driven framework for managing your Zsh configuration.
    Prezto - A speedy Zsh framework. Enriches the command line interface environment with sane defaults, aliases, functions, auto completion, and prompt themes.
    zgen - Another open source framework for managing your zsh configuration. Zgen will load oh-my-zsh compatible plugins and themes and has the advantage of both being faster and automatically cloning any plugins used in your configuration for you.

Terminal Fonts

    Anonymous Pro - A family of four fixed-width fonts designed with coding in mind.
    Codeface - A gallery and repository of monospaced fonts for developers.
    DejaVu Sans Mono - A font family based on the Vera Fonts.
    Hack - Hack is hand groomed and optically balanced to be your go-to code face.
    Inconsolata - A monospace font, designed for code listings and the like.
    Input - A flexible system of fonts designed specifically for code.
    Meslo - Customized version of Apple's Menlo font.
    Operator Mono - A surprisingly usable alternative take on a monospace font (commercial).
    Powerline Fonts - Repo of patched fonts for the Powerline plugin.
    Source Code Pro - A monospaced font family for user interfaces and coding environments.

License

Creative Commons License
This work is licensed under a Creative Commons Attribution-ShareAlike 4.0 International License.

    Contact GitHub API Training Shop Blog About 

    © 2017 GitHub, Inc. Terms Privacy Security Status Help 



echo "› sudo softwareupdate -i -a"
sudo softwareupdate -i -a
