#!/usr/bin/env bash
#
# Installs basic utilities
# abc folder name is used to quickly hack installation order
set -o errexit -o nounset -o pipefail

source "${DOTFILES}/functions/core"

info "Installing basic utilities"

# install base utilities using sudo
if [[ "${SUDO_ALLOWED}" = true ]]; then

  sudo apt-get install -y curl jq git wget unzip zip xclip xsel

fi
success "Basic utilities installed OK"

# I do not want to override the .ssh if it's already present - only for completely new environments
if [[ ! -e ${HOME}/.ssh ]]
then
  info "Basic .ssh configuration"

  mkdir "${HOME}/.ssh"
cat >  "${HOME}/.ssh/config" << EOL
# too prevent connection closed due to too many failed attempts
# https://www.tecmint.com/fix-ssh-too-many-authentication-failures-error/
Host *
	IdentitiesOnly=yes

# personal gitlab
Host gitlab.com
	HostName gitlab.com
	IdentityFile ~/.ssh/id_rsa_gitlab


# personal github
Host github.com
	HostName github.com
	IdentityFile ~/.ssh/id_rsa_github
EOL
  chmod 600 "${HOME}/.ssh/config"
  success ".ssh configured OK"

fi

