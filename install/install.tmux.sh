#!/usr/bin/env bash
source ./install/utils.sh


if [ -d ~/.tmux/plugins/tpm ]; then
	success "tmux plugins already installed"  	
else
	info "installing tmux plugin manager"
  	git clone https://github.com/tmux-plugins/tpm ~/.tmux/plugins/tpm
fi
