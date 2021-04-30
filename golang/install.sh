#!/bin/bash -x

mkdir -p ~/git/github.com/ghasemnaddaf ~/git/github.com/gshirazi ~/git/gitlab.com ~/git/bitbucket.org
mkdir -p ~/src/go/bin
ln -s ~/git ~/src/go/src

# from .zshrc
# export GOPATH=$HOME/go
# export PATH=$GOPATH/bin:$PATH
