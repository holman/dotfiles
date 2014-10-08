#!/usr/bin/zsh
# Update running tmux sessions with possibly new tmux conf
tmux set-option quiet on
tmux source-file ~/.tmux.conf &> /dev/null
tmux set-option quiet off &> /dev/null
