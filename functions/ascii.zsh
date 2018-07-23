#!/bin/bash

asciime(){
  font=slant
  text=
  set -u
  while [[ $# -gt 0 ]]; do
    case $1 in
      '--font'|-f)
        font=$2
        shift
        ;;
      *)
        text="$text $1"
        ;;
    esac
    shift
  done
  set +u
  text=${text#?}
  echo "font: $font"
  echo "text: $text"
  echo
  curl -G --data-urlencode "text=$text" "http://artii.herokuapp.com/make?font=$font"
  echo
}
