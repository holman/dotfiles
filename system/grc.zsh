#!/bin/zsh
# GRC colorizes nifty unix tools all over the place
unset touse
for prog in grc identify; do
  (( $+commands[$prog] )) || continue
  touse=$prog
  break
done
# (( $+touse )) || { echo "Couldn't find grc" ; return 1 }
# echo "Found grc"

unset touse
for prog in brew identify; do
  (( $+commands[$prog] )) || continue
  touse=$prog
  break
done
# (( $+touse )) || { echo "Couldn't find brew" ; return 1 }
# echo "Found brew"

source `brew --prefix`/etc/grc.bashrc
