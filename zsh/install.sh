#!/bin/sh
#
# Oh my zsh
# This script installs oh my zsh for zsh theming
if [[ $(command -v uninstall_oh_my_zsh) == "" ]]; then
    echo -e "\033[1;33m› Installing oh my zsh..\033[0m"
    sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --unattended
fi