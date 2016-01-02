#!/usr/bin/env bash

# GRC colorizes nifty unix tools all over the place
if (( $+commands[pyenv] ))
then
  if which pyenv > /dev/null; then eval "$(pyenv init -)"; fi
  export PYENV_ROOT=/usr/local/var/pyenv
  eval "$(pyenv init -)"
fi