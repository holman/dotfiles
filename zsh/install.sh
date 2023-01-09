#!/usr/bin/env bash
#
# Install ZSH and all the plugins

set -o errexit -o nounset -o pipefail

source "${DOTFILES}/functions/core"

# regreshing oh-my-zsh install (it's installed as part of the initial bootstrapping)
info "refreshing oh-my-zsh"
( cd ~/.oh-my-zsh && git pull )

ZSH_CUSTOM=${ZSH_CUSTOM:=~/.oh-my-zsh/custom}

# zsh completions
info zsh-completions
git_clone_or_update https://github.com/zsh-users/zsh-completions ${ZSH_CUSTOM}/plugins/zsh-completions

# auto suggestions
info zsh-autosuggestions
git_clone_or_update https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM}/plugins/zsh-autosuggestions

# syntax highlight
info zsh-syntax-highlighting
git_clone_or_update https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM}/plugins/zsh-syntax-highlighting

# powerlevel9k install
info powerlevel9k
git_clone_or_update https://github.com/bhilburn/powerlevel9k.git ${ZSH_CUSTOM}/themes/powerlevel9k

# powerlevel 10k install
info powerlevel10k
git_clone_or_update https://github.com/romkatv/powerlevel10k.git ${ZSH_CUSTOM}/themes/powerlevel10k
