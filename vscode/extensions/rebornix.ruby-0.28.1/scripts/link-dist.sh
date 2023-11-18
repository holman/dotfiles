#!/bin/bash

parent=$(cd ../ && pwd)
mkdir -p dist
rm -r dist/server dist/debugger
ln -sf $parent/language-server-ruby/dist dist/server
ln -sf $parent/vscode-ruby-debugger/dist dist/debugger
