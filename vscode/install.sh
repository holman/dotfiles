#!/bin/zsh

set -euo pipefail
IFS=$'\n\t'

# Get the directory of this script
SCRIPT_DIR="${0:A:h}"

# Output formatting
info() { printf "\r\033[2K  [\033[00;34mINFO\033[0m] %s\n" "$1"; }
success() { printf "\r\033[2K  [\033[00;32m OK \033[0m] %s\n" "$1"; }

# Check if VS Code is installed
if ! command -v code >/dev/null 2>&1; then
    echo "VS Code is not installed. Please install it first."
    exit 1
fi

info "Installing VS Code extensions..."

# Read extensions file and install each extension
# Only process lines that don't start with # and aren't empty
cat "$SCRIPT_DIR/extensions.txt" | grep -v '^#' | while read -r line; do
    if [[ -n "$line" ]]; then
        # Extract just the extension ID (everything before the first # or whitespace)
        extension_id=$(echo "$line" | awk '{print $1}')
        if [[ -n "$extension_id" ]]; then
            info "Installing $extension_id"
            code --install-extension "$extension_id" --force
        fi
    fi
done

success "All VS Code extensions have been installed!"

# Export current extensions to the file
info "Updating extensions.txt with current extensions..."
code --list-extensions > /tmp/current_extensions

# Keep only extensions that are actually installed
cat "$SCRIPT_DIR/extensions.txt" | while read -r line; do
    if [[ "$line" =~ ^#.* ]] || [[ -z "$line" ]]; then
        # Keep comments and empty lines
        echo "$line"
    elif grep -q "$(echo "$line" | awk '{print $1}')" /tmp/current_extensions; then
        # Keep installed extensions with their comments
        echo "$line"
    fi
done > "$SCRIPT_DIR/extensions.txt.tmp"

mv "$SCRIPT_DIR/extensions.txt.tmp" "$SCRIPT_DIR/extensions.txt"
rm /tmp/current_extensions
success "Extensions file has been updated!"
