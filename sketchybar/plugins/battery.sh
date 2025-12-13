#!/usr/bin/env sh

# Battery plugin for sketchybar
PERCENTAGE=$(pmset -g batt | grep -Eo '\d+%' | cut -d% -f1)
CHARGING=$(pmset -g batt | grep 'AC Power')

if [ "$PERCENTAGE" -lt 20 ]; then
    ICON=""
elif [ "$PERCENTAGE" -lt 40 ]; then
    ICON=""
elif [ "$PERCENTAGE" -lt 60 ]; then
    ICON=""
elif [ "$PERCENTAGE" -lt 80 ]; then
    ICON=""
else
    ICON=""
fi

if [ -n "$CHARGING" ]; then
    ICON=""
fi

sketchybar --set "$NAME" label="$PERCENTAGE%" icon="$ICON"