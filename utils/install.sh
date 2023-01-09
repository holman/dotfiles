#!/usr/bin/env bash
#
# Installs basic utilities
# basic folder name is used to quickly hack installation order
set -o errexit -o nounset -o pipefail

# DOTFILES is set by the bootstrap script, if the script is used not use common default
DOTFILES="${DOTFILES:-${HOME}/.dotfiles}"
source "${DOTFILES}/functions/core"

info "Installing extra utilities"

(
  # https://github.com/PaulJuliusMartinez/jless
  VERSION_JLESS=v0.7.2
  cd "$(mktemp -d)"
  curl -OL https://github.com/PaulJuliusMartinez/jless/releases/download/${VERSION_JLESS}/jless-${VERSION_JLESS}-x86_64-unknown-linux-gnu.zip
  unzip jless-${VERSION_JLESS}-x86_64-unknown-linux-gnu.zip
  mv jless "${HOME}/bin/"
)

if [[ "${SUDO_ALLOWED}" = true ]]; then
  sudo apt-get install -y mc btop neofetch ncdu duf
fi

success "Extra utilities installed OK"

