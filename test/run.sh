#!/usr/bin/env bash

cd "$(dirname "$0")/.."

docker build -t dotfiles .
docker run -it dotfiles
