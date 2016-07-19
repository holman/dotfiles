if [ ! -d ~/.iterm ]; then
	echo "Installing iterm configuration"
	ln -s ~/.dotfiles/iterm ~/.iterm
fi