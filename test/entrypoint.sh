#!/usr/bin/env bash

NAME="$(uname -s)"
RELEASE="$(uname -r)"

cd "$(dirname "$0")/.."
echo

if ([[ "$RELEASE" = *'boot2docker' ]] || [[ "$RELEASE" = *'moby' ]]) && \
        [[ "$1" = 'docker' ]] ; then
    echo 'You are using docker!'
    echo 'I will assume bootstrap is being run as an entrypoint...'
    echo

    source 'script/bootstrap'

    if [[ "$SHELL" != *'zsh' ]]; then
        SHELL="$(which zsh)"
    fi
    exec "$SHELL" -li
else
    echo "Uh oh! $NAME $RELEASE is not Docker..."
    echo
fi
