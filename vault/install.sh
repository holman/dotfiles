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

setup_vault () {

  vault_addr='export VAULT_ADDR=https://vault.trustpilot.com'

  grep -q "$vault_addr" $HOME/.bash_profile && return;

  info 'setup Vault .bash_profile'
  user ' - Enter your Git Hub Read-only token for vault:'
  read -e github_apikey
  
  vault_github_token='export VAULT_AUTH_GITHUB_TOKEN='$github_apikey

  grep -q "$vault_addr" $HOME/.bash_profile || echo "$vault_addr" >> $HOME/.bash_profile
  grep -q "$vault_github_token" $HOME/.bash_profile || echo "$vault_github_token" >> $HOME/.bash_profile
}

info  "Running: ./vault/install.sh"
setup_vault
success "./vault/install.sh"