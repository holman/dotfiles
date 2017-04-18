#!/bin/sh
theme='Material Peacock Optimized.icls'
target="${HOME}/Library/Preferences/PhpStorm2017.1/colors/"

if [ ! -d "${target}" ]
then
  mkdir -p ${target}
fi

if [ ! -L "${target}${theme}" ]
then
  ln -s "./pstorm/${theme}" "${target}"
fi
