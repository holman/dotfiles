#!/usr/bin/env bash
#
# Install kubectl and related packages

set -o errexit -o nounset -o pipefail

# DOTFILES is set by the bootstrap script, if the script is used not use common default
DOTFILES="${DOTFILES:-${HOME}/.dotfiles}"
source "${DOTFILES}/functions/core"

if [[ "${ENVIRONMENT}" != ACS ]]; then
  info "Installing Azure CLI"
  curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
  success "Azure CLI installed OK"
fi
