#!/bin/zsh -ex

echo "Check if startup is sufficiently fast"
measure-runtime.py --repeat=10 --expected-ms 275 zsh -i -c 'exit'
