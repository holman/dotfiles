#!/usr/bin/env bash

backup_file () {
  local dst=$1 print=$2
  mkdir -p "$HOME"/backup-dot-files"$dst"
  mv "$dst" "$HOME"/backup-dot-files"$dst"
  if [ "$print" == "true" ]
  then
    echo "moved $dst to $HOME/backup-dot-files"
  fi
}

setup_file () {
  local src=$1 dst=$2
  if [[ -f "$2" ]]
  then
    backup_file "$dst" "true"
  fi;
  ln -s "$src" "$dst"
}

# Configure settings_directory by platform
if test "$(uname)" = "Darwin"
then
  settings_directory="/Users/$USER/"'Library/Application Support/Code/User'
else
  echo 'Unsure where to install on non-macos platforms'
  echo 'Please edit ./vscode/install.sh'
  # settings_directory=???
  echo '-----VSCODE configuration NOT COMPLETE----'
  exit 1
fi

setup_file "$DOTFILES/vscode/settings.json" "$settings_directory/settings.json"
setup_file "$DOTFILES/vscode/keybindings.json" "$settings_directory/keybindings.json"

# Install vscode extensions
# http://evanhahn.com/atom-apm-install-list/
source "$DOTFILES"/functions/code-extension
code-extension install-all

exit 0