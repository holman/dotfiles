# Uses NVM for Node version management. Assumes an install of nvm
# via https://github.com/creationix/nvm.
#
# NVM Install Script:
# curl https://raw.github.com/creationix/nvm/master/install.sh | sh

nvm_directory="$HOME/.nvm"

# Source NVM
[[ -s "$nvm_directory/nvm.sh" ]] && . "$nvm_directory/nvm.sh"

# Add NVM bash completion
[[ -r "$nvm_directory/bash_completion" ]] && . "$nvm_directory/bash_completion"
