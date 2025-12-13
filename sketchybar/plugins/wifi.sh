#!/usr/bin/env sh

# WiFi plugin for sketchybar
WIFI_STATUS=$(airport -I | grep -E 'state: (running|associated)' | wc -l)

if [ "$WIFI_STATUS" -eq 1 ]; then
    SSID=$(airport -I | grep '    SSID:' | awk '{print $2}')
    sketchybar --set "$NAME" label="$SSID" icon=""
else
    sketchybar --set "$NAME" label="Off" icon=""
fi