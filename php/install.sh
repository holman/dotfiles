#!/bin/sh
#
# PHP
#
# This installs some of the conf stuff to utilize the built in PHP.

  printf "${BLUE}Looking for an existing php.ini at /private/etc/php.ini...${NORMAL}\n"
  if [ -f /private/etc/php.ini ] || [ -h /private/etc/php.ini ]; then
    printf "${YELLOW}Found /private/etc/php.ini.${NORMAL} ${GREEN}Backing up to /private/etc/php.ini.original${NORMAL}\n";
    sudo mv /private/etc/php.ini /private/etc/apache2/php.ini.original;
  fi
  printf "${BLUE}Symlinking your php.ini to /private/etc/php.ini${NORMAL}\n"
  sudo ln -s /Users/jcobb/.dotfiles/php/php.ini /private/etc/php.ini

exit 0
