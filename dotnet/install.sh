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

setup_nuget () {
  [ -f ~/.config/NuGet/NuGet.Config ] && return;

  info 'setup NuGet'
  user ' - What is your MyGet api key?'
  read -e nuget_apikey

  nuget setapikey $nuget_apikey -source https://trustpilot.myget.org/F/libraries/

  user ' - What is your MyGet username?'
  read -e myget_username
  user ' - What is your MyGet password?'
  read -s myget_password

  nuget sources add -name 'Trustpilot Myget Libraries' -source https://trustpilot.myget.org/F/libraries/ -user $myget_username -pass "${myget_password}" -StorePasswordInClearText

  # Fix dotnet looking into wrong location for config
  rm -rf ~/.nuget/NuGet/NuGet.Config
  ln -s ~/.config/NuGet/NuGet.Config ~/.nuget/NuGet/NuGet.Config
}

info 'Setting up NuGet'
setup_nuget