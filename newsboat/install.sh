#!/bin/sh
#
# Newsboat
#

# Variables
FILES=(
  "$ZSH/newsboat/config:$HOME/.newsboat/config"
  "$ZSH/newsboat/urls:$HOME/.newsboat/urls"
)

# Iterate over the list of files
for FILE_PAIR in "${FILES[@]}"; do
  # Split the source and destination using ':' as the delimiter
  IFS=":" read -r SOURCE DEST <<< "$FILE_PAIR"

  # Check if the source file exists
  if [ ! -e "$SOURCE" ]; then
    echo "Source file $SOURCE does not exist. Skipping."
    continue
  fi

  # Check if the destination file exists
  if [ -e "$DEST" ]; then
    echo "Destination $DEST already exists. Replacing it."
    rm -f "$DEST"
  fi

  # Create the hard link
  ln "$SOURCE" "$DEST"
  if [ $? -eq 0 ]; then
    echo "Hard link created: $DEST -> $SOURCE"
  else
    echo "Failed to create hard link for $SOURCE -> $DEST"
  fi
done

exit 0
