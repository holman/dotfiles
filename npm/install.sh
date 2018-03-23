#!/usr/bin/env bash

info () {
  printf "\r  [ \033[00;34m..\033[0m ] $1\n"
}

user () {
  printf "\r  [ \033[0;33m??\033[0m ] $1\n"
}

success () {
  printf "\r\033[2K  [ \033[00;32mOK\033[0m ] $1\n"
}

fail () {
  printf "\r\033[2K  [\033[0;31mFAIL\033[0m] $1\n"
  echo ''
  exit
}

setup_npm () {
    registry="https://trustpilot.myget.org/F/npm/npm/"


    if [ -z `grep ${registry} ~/.npmrc` ]; then
      npm config set @trustpilot:registry=${registry}
      npm config set always-auth true --registry ${registry}

      info "Adding NPM repo tokens"
      npm login --registry ${registry} --scope=@trustpilot
    fi

    npm install -g @trustpilot/confocto
    confocto setup 
}

setup_npm
success "npm/install.sh"