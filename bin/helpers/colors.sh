#!/bin/sh


info () {
  level=1
  message="\r  [ \033[00;34m..\033[0m ] $1\n"

  if [ -n "$2" ]; then
    level=$2
  fi

  case ${level} in
    1)
        printf "${message}" "" >&1
        ;;
    2)
        printf "${message}" "" >&3
        ;;
    3)
        printf "${message}" "" >&4
        ;;
    4)
        printf "${message}" "" >&5
        ;;
  esac
}

question () {
    if [ ! -n "$2" ]; then
        fail "question method requires at least 2 parameters"
        exit 1
    fi

    local _answer=$2
    local _default=$3

    printf "\r  [ \033[0;33m??\033[0m ] ${1} " ;

    if ! [ -z ${_default} ];
    then
        printf "[\033[00;32m${_default}\033[0m] "
    fi

     read -r answer

    if ! [ -z ${_default} ] && [ -z ${answer} ];
    then
        answer=${_default}
    fi

    eval $_answer="'$answer'"
}

user () {
  printf "\r  [ \033[0;33m??\033[0m ] $1\n"
}

success () {
  printf "\r\033[2K  [ \033[00;32mOK\033[0m ] $1\n"
  notify $*
}

warn () {
  printf "\r\033[2K  [\033[00;33m !! \033[0m] $1\n"
}

fail () {
  printf "\r\033[2K  [\033[0;31m !! \033[0m] $1\n" >&2
  exit 1
}

notify(){
    if hash osascript 2> /dev/null; then
        osascript -e "display notification \"$*\" with title \"Dotfiles\""
    fi
}
