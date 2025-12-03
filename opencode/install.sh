#!/bin/bash

# Install OpenCode using the official method
curl -fsSL https://opencode.ai/install | bash

# Create ~/.config/opencode directories if they don't exist
mkdir -p ~/.config/opencode

# Copy agents and commands to the OpenCode config directory
cp -r "$(dirname "$0")/agent" ~/.config/opencode/ 2>/dev/null || true
cp -r "$(dirname "$0")/command" ~/.config/opencode/ 2>/dev/null || true

echo "✅ OpenCode installed successfully with custom agents and commands in ~/.config/opencode"
