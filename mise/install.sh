#!/bin/sh
#
# mise
#
# This installs mise, the successor to asdf, rtx, etc.

# Check for mise
if test ! $(which mise)
then
  echo "  Installing mise for you."
  curl https://mise.run | sh
fi

# Add mise activation to ~/.zshrc if not already present
if ! grep -q "mise activate" ~/.zshrc
then
  echo 'eval "$(~/.local/bin/mise activate zsh)"' >> ~/.zshrc
fi

# Install node using mise
if command -v mise >/dev/null 2>&1; then
  echo "  Installing node using mise."
  ~/.local/bin/mise use --global node@latest
fi

# Install npm packages from npmfile
if [ -f "npmfile" ]; then
  echo "  Installing npm packages from npmfile."
  cat "npmfile" | while read package; do
    if [ ! -z "$package" ]; then
      echo "  Installing $package"
      npm install -g "$package"
    fi
  done
fi

exit 0