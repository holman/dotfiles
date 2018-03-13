# path, the 0 in the filename causes this to load first

pathAppend() {
  # Only adds to the path if it's not already there
  if ! echo $PATH | egrep -q "(^|:)$1($|:)" ; then
    PATH=$PATH:$1
  fi
}

# Path to your dotfiles installation.
export DOTFILES=$HOME/.dotfiles
export ZSH=~/.dotfiles

# Remove duplicate entries from PATH:
PATH=$(echo "$PATH" | awk -v RS=':' -v ORS=":" '!a[$1]++{if (NR > 1) printf ORS; printf $a[$1]}')

# Local bin directories before anything else
export PATH="/usr/local/bin:/usr/local/sbin:$PATH"

pathAppend "$ZSH/bin"


