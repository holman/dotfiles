#!/usr/bin/env bash
#
# Installs basic utilities
# basic folder name is used to quickly hack installation order
set -o errexit -o nounset -o pipefail

# DOTFILES is set by the bootstrap script, if the script is used not use common default
DOTFILES="${DOTFILES:-${HOME}/.dotfiles}"
source "${DOTFILES}/functions/core"

info "Installing vim utilities"

mkdir -p "${HOME}/.vim/autoload" "${HOME}/.vim/bundle"
curl -LSso ${HOME}/.vim/autoload/pathogen.vim https://tpo.pe/pathogen.vim

info "Vundle"
git_clone_or_update https://github.com/VundleVim/Vundle.vim.git ${HOME}/.vim/bundle/Vundle.vim

info "Nerdtree for Vim..."
echo ''
git_clone_or_update https://github.com/scrooloose/nerdtree.git ${HOME}/.vim/bundle/nerdtree

info "vim wombat color scheme..."
git_clone_or_update https://github.com/sheerun/vim-wombat-scheme.git ${HOME}/.vim/colors/wombat
mv ${HOME}/.vim/colors/wombat/colors/* ${HOME}/.vim/colors/


success "Vim utilities installed OK"



