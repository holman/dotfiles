#!/usr/bin/env zsh

info () {
  printf "\r  [ \033[00;34m..\033[0m ] $1\n"
}

success () {
  printf "\r\033[2K  [ \033[00;32mOK\033[0m ] $1\n"
}

# Source Prezto.
if [[ -s "${ZDOTDIR:-$HOME}/.zprezto/init.zsh" ]]; then
  source "${ZDOTDIR:-$HOME}/.zprezto/init.zsh"
  zprezto-update
else
  echo "Installing zprezto"
  git clone --recursive https://github.com/sorin-ionescu/prezto.git "${ZDOTDIR:-$HOME}/.zprezto" 2>/dev/null
  source "${ZDOTDIR:-$HOME}/.zprezto/init.zsh"
fi

info "Installing zpresto contrib"

if [[ -d "${ZDOTDIR:-$HOME}/.zprezto/contrib" ]]; then
  cd -q -- "${ZDOTDIR:-$HOME}/.zprezto/contrib" || return 7
  if git pull --ff-only; then
    info "Syncing zprezto contrib submodules"
    git submodule update --recursive
    return $?
  fi
else
  echo "Installing zprezto contrib"
  git clone --recursive https://github.com/belak/prezto-contrib "${ZDOTDIR:-$HOME}/.zprezto/contrib" 2>/dev/null
fi

success "./zsh/install.sh"






