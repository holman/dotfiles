#!/usr/bin/env bash

cd "$(dirname "$0")/.."
source 'script/bootstrap'

NAME="$(uname -s)"
RELEASE="$(uname -r)"

if ([[ "$RELEASE" = *'boot2docker' ]] || [[ "$RELEASE" = *'moby' ]]) && \
        [[ "$1" = 'docker' ]] ; then
    echo
    echo 'You are using docker!'
    echo 'I will assume bootstrap is being run as an entrypoint...'
    echo

    if [[ "$SHELL" != *'zsh' ]]; then
        SHELL="$(which zsh)"
    fi
    exec "$SHELL" -li
fi
