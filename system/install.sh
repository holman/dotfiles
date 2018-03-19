#!/usr/bin/env bash
# Create a Projects directory
# This is a default directory for macOS user accounts but doesn't comes pre-installed

info () {
  printf "\r  [ \033[00;34m..\033[0m ] $1\n"
}

success () {
  printf "\r\033[2K  [ \033[00;32mOK\033[0m ] $1\n"
}

mkdir -p $HOME/Projects
success "./system/install.sh"


