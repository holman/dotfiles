#!/bin/bash

if test "$(which pyenv)"; then
  eval "$(pyenv init --path)"
fi
