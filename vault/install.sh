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

  touch $HOME/.localrc
  grep -q "$vault_addr" $HOME/.localrc && return;

  info 'setup Vault'
  user ' - Enter your Git Hub Personal access token for vault (read:org):'
  read -e github_apikey
  
  vault_github_token='export VAULT_AUTH_GITHUB_TOKEN='$github_apikey

  grep -q "$vault_addr" $HOME/.localrc || echo "$vault_addr" >> $HOME/.localrc
  grep -q "$vault_github_token" $HOME/.localrc || echo "$vault_github_token" >> $HOME/.localrc

  source $HOME/.localrc

  vault login -method=github
}

setup_aws_role () {
  go get github.com/trustpilot/aws-role
}

info  "Running: ./vault/install.sh"
setup_vault
setup_aws_role
success "./vault/install.sh"