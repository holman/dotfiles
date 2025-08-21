#!/bin/bash

# Create ~/.config/zed directory if it doesn't exist
mkdir -p ~/.config/zed

# Copy settings.json to the Zed config directory
cp "$(dirname "$0")/settings.json" ~/.config/zed/settings.json

echo "✅ Zed settings installed successfully to ~/.config/zed/settings.json"
