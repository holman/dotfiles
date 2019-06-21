#!/usr/bin/env bash

# Download docsets

# Configure licensce
FILE="/Users/$USER/Dropbox/config/purchase/license4.dash-license";
[ -f "$FILE" ] && o "$FILE";

FILE="/Users/$USER/Dropbox/applications/dash/Dash.dashsync";
[ -f "$FILE" ] && o "$FILE";

# Quit Dash
osascript -e 'quit app "DASH"';
