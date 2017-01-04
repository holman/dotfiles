#!/bin/sh
#
# This installs some terminfo stuff for italics
#
#
set -e

tic -o ~/.terminfo tmux-256color.terminfo
tic -o ~/.terminfo tmux.terminfo
tic -o ~/.terminfo xterm-256color.terminfo
