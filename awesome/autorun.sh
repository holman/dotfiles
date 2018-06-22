#!/usr/bin/env bash

function run {
  if ! pgrep $1 ;
  then
    $@&
  fi
}

run xscreensaver -nosplash
run synapse
# run pulseaudio --start
