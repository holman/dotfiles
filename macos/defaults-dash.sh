#!/usr/bin/env bash

# Download docsets

# Configure licensce
FILE="/Users/$USER/Dropbox/config/purchase/license4.dash-license";
[ -f "$FILE" ] && open "$FILE";

# Configure dash sync
FILE="/Users/$USER/Dropbox/applications/dash/Dash.dashsync";
[ -f "$FILE" ] && open "$FILE";

# quit dash
{
  # the following is necessary due to dialog prompt if license is active
  sleep 2
  osascript -e 'tell application "DASH" to activate'
  osascript -e 'tell application "System Events" to key code 36' #return
  sleep 1
  osascript -e 'quit app "DASH"'
} || {
  echo "failed to quit dash in macos/defaults-dash.sh"
}
