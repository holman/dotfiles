#!/bin/sh
#
# Homebrew
#
# This updates the installed packages from brew.

OUTDATED_LIST=($(brew outdated --quiet))

if [ ! -z ${OUTDATED_LIST} ]
then
  # Print the complete list of packages that are outdated.
  echo ''
  echo '       - The following packages can be upgraded:'
  brew outdated
  echo ''

  # Array to hold the list of outdated packages we are wanting to upgrade.
  UPGRADE_LIST=()
  yes_all=false


  for package in ${OUTDATED_LIST[*]}
  do
    yes=false

    if [ "$yes_all" == "false" ]
    then
      user "Would you like to upgrade $package [y]es, [n]o, [Y]es All, [N]o All?"
      read action

      case "$action" in
        y )
          yes=true;;
        Y )
          yes_all=true;;
        N )
          break;;
        * )
          ;;
      esac
    fi

    if [ "$yes" == "true" ] || [ "$yes_all" == "true" ]
    then
      UPGRADE_LIST[${#UPGRADE_LIST[*]}]="$package"
    fi
  done

  if [ ! -z "${UPGRADE_LIST}" ]
  then
    echo ''

    for package in ${UPGRADE_LIST[*]}
    do
      info "Installing $package"

      if $(brew upgrade $package > /tmp/dot-upgrade 2>&1)
      then
        success "Upgraded $package"
      else
        fail "Failed to upgrade $package."
      fi
    done
  fi
fi