#!/usr/bin/env bash
#
# bootstrap links.

#cd "$(dirname "$0")/.."
# cd ~/Downloads/
# mkdir jDownloader
# mkdir Filmes

# DOTFILES_ROOT=$(pwd -P)
DOTFILES_THOMAS_ROOT="$HOME/.dotfiles/thomas"
#whoami
link_file () {
  local src=$1 dst=$2

  local overwrite= backup= skip=
  local action=

  if [ -f "$dst" -o -d "$dst" -o -L "$dst" ]
  then

    if [ "$overwrite_all" == "false" ] && [ "$backup_all" == "false" ] && [ "$skip_all" == "false" ]
    then

      local currentSrc="$(readlink $dst)"

      if [ "$currentSrc" == "$src" ]
      then

        skip=true;

      else

        user "File already exists: $dst ($(basename "$src")), what do you want to do?\n\
        [s]kip, [S]kip all, [o]verwrite, [O]verwrite all, [b]ackup, [B]ackup all?"
        read -n 1 action

        case "$action" in
          o )
            overwrite=true;;
          O )
            overwrite_all=true;;
          b )
            backup=true;;
          B )
            backup_all=true;;
          s )
            skip=true;;
          S )
            skip_all=true;;
          * )
            ;;
        esac

      fi

    fi

    overwrite=${overwrite:-$overwrite_all}
    backup=${backup:-$backup_all}
    skip=${skip:-$skip_all}

    if [ "$overwrite" == "true" ]
    then
      rm -rf "$dst"
      echo "removed $dst"
    fi

    if [ "$backup" == "true" ]
    then
      mv "$dst" "${dst}.backup"
      echo "moved $dst to ${dst}.backup"
    fi

    if [ "$skip" == "true" ]
    then
      echo "skipped $src"
    fi
  fi

  if [ "$skip" != "true" ]  # "false" or empty
  then
    ln -s "$1" "$2"
    echo "linked $1 to $2"
  fi
}

install_main () {
  echo 'installing thinks'

  local overwrite_all=false backup_all=false skip_all=false

  # Folder Structure
  for src in $(find -H "$DOTFILES_THOMAS_ROOT" -maxdepth 2 -name 'settings.folderstructure' -not -path '*.git*')
  do

    while read line
    do
      # Replace ~ for $HOME
      line=${line//\~/$HOME}
      # Create if not exists
      mkdir -p ${line}
    done < $src

  done

  # Folder SymLinks
  for src in $(find -H "$DOTFILES_THOMAS_ROOT" -maxdepth 2 -name 'settings.foldersymlink' -not -path '*.git*')
  do

    while read line
    do
    	# Replace ~ for $HOME
    	line=${line//\~/$HOME}
    	# Split $line to array
    	array=(${line//;/ })
    	# Create if not exists
		  mkdir -p ${array[0]}
		  # Create link
      # link_file "${array[0]}" "${array[1]}"
    	ln -s "${array[0]}" "${array[1]}"

    done < $src
 	
  done
}
install_main
