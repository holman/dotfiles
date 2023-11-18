#!/bin/bash

rm -r dist/server dist/debugger
cp -R ../language-server-ruby/dist dist/server
cp -R ../vscode-ruby-debugger/dist dist/debugger
