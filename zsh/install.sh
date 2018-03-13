#!/usr/bin/env zsh

# Source Prezto.
if [[ -s "${ZDOTDIR:-$HOME}/.zprezto/init.zsh" ]]; then
  source "${ZDOTDIR:-$HOME}/.zprezto/init.zsh"
  zprezto-update
else
  echo "Installing zprezto"
  git clone --recursive https://github.com/sorin-ionescu/prezto.git "${ZDOTDIR:-$HOME}/.zprezto" 2>/dev/null
  git clone --recursive https://github.com/belak/prezto-contrib "${ZDOTDIR:-$HOME}/.zprezto/contrib" 2>/dev/null
fi







