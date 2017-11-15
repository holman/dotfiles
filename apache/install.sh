#!/bin/sh
#
# Apache
#
# This installs some of the conf stuff to utilize the built in Apache/PHP.

  printf "${BLUE}Looking for an existing Apache conf at /private/etc/apache2/httpd.conf...${NORMAL}\n"
  if [ -f /private/etc/apache2/httpd.conf ] || [ -h /private/etc/apache2/httpd.conf ]; then
    printf "${YELLOW}Found /private/etc/apache2/httpd.conf.${NORMAL} ${GREEN}Backing up to /private/etc/apache2/httpd.conf.original${NORMAL}\n";
    mv /private/etc/apache2/httpd.conf /private/etc/apache2/httpd.conf.original;
  fi
  printf "${BLUE}Symlinking your httpd.conf to /private/etc/apache2/httpd.conf${NORMAL}\n"
  sudo ln -s /Users/jcobb/.dotfiles/apache/httpd.conf /private/etc/apache2/httpd.conf

  printf "${BLUE}Activating Apache LaunchDaemon${NORMAL}\n"
  sudo launchctl load -w /System/Library/LaunchDaemons/org.apache.httpd.plist

exit 0
