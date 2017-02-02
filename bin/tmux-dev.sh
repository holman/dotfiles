#!/bin/bash
tmux new -s $1
tmux new-window 'web-test'
tmux new-window 'web'
tmux new-window 'db'
tmux new-window 'broker'
tmux new-window 'worker'
tmux new-window 'es'
