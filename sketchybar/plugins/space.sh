#!/usr/bin/env sh

# Space indicator plugin for sketchybar
# Shows whether a space is focused and has windows

SPACE=$(echo "$NAME" | sed 's/space\.//')
FOCUSED=$(aerospace list-workspaces --focused | grep -c "$SPACE")
VISIBLE=$(aerospace list-workspaces --monitor focused --visible | grep -c "$SPACE")
WINDOWS=$(aerospace list-windows --workspace "$SPACE" | wc -l)

if [ "$FOCUSED" -eq 1 ]; then
    sketchybar --set "$NAME" icon.highlight=true label.highlight=true
else
    sketchybar --set "$NAME" icon.highlight=false label.highlight=false
fi

if [ "$WINDOWS" -gt 0 ]; then
    sketchybar --set "$NAME" label="$WINDOWS"
else
    sketchybar --set "$NAME" label=""
fi