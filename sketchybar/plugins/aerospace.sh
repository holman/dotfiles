#!/usr/bin/env sh

# Aerospace workspace plugin for sketchybar
# Shows current workspace and focused window

WORKSPACE=$(aerospace list-workspaces --monitor focused --visible | head -1)
WINDOW=$(aerospace list-windows --workspace "$WORKSPACE" --focused | awk -F'|' '{print $2}' | xargs)

if [ -n "$WINDOW" ]; then
    sketchybar --set "$NAME" label="$WORKSPACE: $WINDOW"
else
    sketchybar --set "$NAME" label="$WORKSPACE"
fi