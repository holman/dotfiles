#!/usr/bin/env bash

info () {
  printf "\r  [ \033[00;34m..\033[0m ] $1\n"
}

success () {
  printf "\r\033[2K  [ \033[00;32mOK\033[0m ] $1\n"
}

info "Installing golang tools"

source $(dirname $0)/path.zsh

go get -v \
  github.com/mdempsky/gocode \
  github.com/uudashr/gopkgs/cmd/gopkgs \
  github.com/ramya-rao-a/go-outline \
  github.com/acroca/go-symbols \
  golang.org/x/tools/cmd/guru \
  golang.org/x/tools/cmd/gorename \
  github.com/derekparker/delve/cmd/dlv \
  github.com/rogpeppe/godef \
  github.com/sqs/goreturns \
  github.com/golang/lint/golint

success "Installed golang tools"
