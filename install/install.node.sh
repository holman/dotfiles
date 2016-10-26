#!/usr/bin/env bash
source ./install/utils.sh

if [[ -s "$HOME/.nvm/nvm.sh" ]]; then
	success "nvm already installed"
else
	info "installing node version manager"
	curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.32.1/install.sh | bash
	
	info "activating nvm"
	export NVM_DIR="$HOME/.nvm"
	[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"  # This loads nvm

	info "downloading default node version"
	nvm install 7.0.0
	nvm use 7.0.0
fi

if test $(which npm); then
    info "installing npm global modules"
    npm install -g cordova eslint tern
fi
