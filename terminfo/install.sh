#!/bin/sh
#
# This installs some terminfo stuff for italics
#
#
set -e
echo "› installs some terminfo stuff for italic"
tic -o ~/.terminfo $ZSH/terminfo/tmux-256color.terminfo
tic -o ~/.terminfo $ZSH/terminfo/tmux.terminfo
tic -o ~/.terminfo $ZSH/terminfo/xterm-256color.terminfo
