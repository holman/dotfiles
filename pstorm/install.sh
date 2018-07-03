#!/bin/sh
theme='Material Peacock Optimized.icls'
target="${HOME}/Library/Preferences/PhpStorm2018.1/colors/"

if [ ! -d "${target}" ]
then
  mkdir -p ${target}
fi

if [ ! -L "${target}${theme}" ]
then
  cp "./pstorm/${theme}" "${target}"
fi
