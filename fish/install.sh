#!/usr/bin/env fish

# Install fisherman
# Asynchronous plugin manager for fish shell
curl -Lo ~/.config/fish/functions/fisher.fish --create-dirs git.io/fisher

function setloginshell ()
	# Check current user login shell
	set user_shell (finger (whoami) | grep Shell | cut -d':' -f 3 | xargs)

	if [ $user_shell != '/usr/local/bin/fish' ]

		# Add fish to permitted login shells
		if not test (grep '/usr/local/bin/fish' /etc/shells)
			echo 'Adding fish as a non standard shell'
			echo '/usr/local/bin/fish' | sudo tee -a /etc/shells
		end

		# Set fish to login shell
		chsh -s /usr/local/bin/fish
	end
end

setloginshell

# Symlink config specially
mkdir -p ~/.config/fish

# Only attempt to create the symlink if not created
if not test -e ~/.config/fish/config.fish
	ln -s ~/.dotfiles/fish/config.fish ~/.config/fish/config.fish
end

if not test -e ~/.config/fish/fishfile
	ln -s ~/.dotfiles/fish/fishfile ~/.config/fish/fishfile
end

# Install some plugins
# z - change directory figure outer
# fzf - fuzzy finder
# pure - prompt
# bass - use bash scripts in fish (eg. source files)
fisher z fzf rafaelrinaldi/pure edc/bass
