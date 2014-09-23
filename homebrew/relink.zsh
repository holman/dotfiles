#!/usr/bin/env zsh

function brew-relink-all() {
  ls -1 /usr/local/Library/LinkedKegs | while read line; do
      echo $line
      brew unlink $line
      brew link --force $line
  done
}
