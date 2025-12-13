#!/usr/bin/env sh

# Startup configuration for aerospace, sketchybar, and borders
# This script configures launch agents to start the applications on login

LAUNCH_AGENTS_DIR="$HOME/Library/LaunchAgents"

# Create launch agents directory if it doesn't exist
mkdir -p "$LAUNCH_AGENTS_DIR"

# Aerospace launch agent
cat > "$LAUNCH_AGENTS_DIR/com.nikitabobko.aerospace.plist" << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.nikitabobko.aerospace</string>
    <key>ProgramArguments</key>
    <array>
        <string>/opt/homebrew/bin/aerospace</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
</dict>
</plist>
EOF

# Sketchybar launch agent
cat > "$LAUNCH_AGENTS_DIR/com.felixkratz.sketchybar.plist" << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.felixkratz.sketchybar</string>
    <key>ProgramArguments</key>
    <array>
        <string>/opt/homebrew/bin/sketchybar</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
</dict>
</plist>
EOF

# Borders launch agent
cat > "$LAUNCH_AGENTS_DIR/com.felixkratz.borders.plist" << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.felixkratz.borders</string>
    <key>ProgramArguments</key>
    <array>
        <string>/opt/homebrew/bin/borders</string>
        <string>active_color=0xff89b4fa</string>
        <string>inactive_color=0xff313244</string>
        <string>width=2.0</string>
        <string>style=round</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
</dict>
</plist>
EOF

# Load the launch agents
launchctl load "$LAUNCH_AGENTS_DIR/com.nikitabobko.aerospace.plist"
launchctl load "$LAUNCH_AGENTS_DIR/com.felixkratz.sketchybar.plist"
launchctl load "$LAUNCH_AGENTS_DIR/com.felixkratz.borders.plist"

echo "Startup configuration complete. Applications will launch on next login."