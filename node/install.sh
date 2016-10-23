if [[ -s "$HOME/.nvm/nvm.sh" ]]; then
	echo "Nvm already installed"
else
	echo "Installing nvm"
	curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.32.1/install.sh | bash
	
	echo "Activating nvm"
	export NVM_DIR="$HOME/.nvm"
	[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"  # This loads nvm

	echo "Downloading default node version"
	nvm install 6.6.0
	nvm use 6.6.0
fi

if test $(which npm); then
    echo "Installing npm global modules"
    npm install -g cordova eslint tern
fi
