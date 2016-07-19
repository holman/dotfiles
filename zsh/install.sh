echo "Installing oh-my-zsh"
sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"

#restore config previously symlinked
if [ -e ~/.zshrc.pre-oh-my-zsh] then
	echo "Overwriting default oh-my-zshrc with previous configuration"
	mv ~/.zshrc.pre-oh-my-zsh ~/.zshrc
fi