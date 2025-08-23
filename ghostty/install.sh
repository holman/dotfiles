#!/bin/bash

# Set source directory
SOURCE_DIR="$(cd "$(dirname "$0")" && pwd)"

# Set target directory and file
TARGET_DIR="$HOME/.config/ghostty"
CONFIG_FILE="$TARGET_DIR/config"

# Create the target directory if it doesn't exist
mkdir -p "$TARGET_DIR"

echo "Installing ghostty configuration..."

# Ensure config file exists
touch "$CONFIG_FILE"

# Copy themes directory separately
if [ -d "$SOURCE_DIR/themes" ]; then
    mkdir -p "$TARGET_DIR/themes"
    echo "Copying theme files to $TARGET_DIR/themes/"
    cp -R "$SOURCE_DIR/themes/"* "$TARGET_DIR/themes/" 2>/dev/null || true
    echo "Theme files copied successfully."
fi

# Count of files processed
count=0

# Find all regular files except install.sh in the source directory
for file in "$SOURCE_DIR"/*; do
    # Skip the install script itself and directories
    if [ "$(basename "$file")" = "install.sh" ] || [ -d "$file" ]; then
        continue
    fi

    # Append file content to the config file
    echo "# Contents from $(basename "$file")" >> "$CONFIG_FILE"
    cat "$file" >> "$CONFIG_FILE"
    echo "" >> "$CONFIG_FILE"  # Add empty line for separation
    echo "Appended contents of $(basename "$file") to config"
    count=$((count+1))
done

if [ $count -eq 0 ]; then
    echo "No configuration files found to copy."
else
    echo "$count file(s) copied to $CONFIG_FILE"
fi

echo "Ghostty configuration installed successfully."
