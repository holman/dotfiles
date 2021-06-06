#!/bin/sh
export TMUX_DIR="$HOME/.tmux"

mkdir -p $TMUX_DIR
if [ ! -d "$TMUX_DIR/plugins/tpm" ]; then
     git clone https://github.com/tmux-plugins/tpm $TMUX_DIR/plugins/tpm
     $TMUX_DIR/plugins/tpm/bin/install_plugins
fi
