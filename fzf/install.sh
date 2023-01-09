#!/usr/bin/env bash
#
# Install kubectl and related packages

set -o errexit -o nounset -o pipefail

source "${DOTFILES}/functions/core"

# Command line fuzzy finder: https://github.com/junegunn/fzf
info "Installing fzf - Command line fuzzy finder"
git_clone_or_update https://github.com/junegunn/fzf.git "${HOME}/.fzf"
sh -c "${HOME}/.fzf/install --key-bindings --completion --no-update-rc"
