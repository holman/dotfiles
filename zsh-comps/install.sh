if [[ -d "${ZDOTDIR:-$HOME}/.dotfiles/external/zsh-completions/src" ]]; then
  ln -s "${ZDOTDIR:-$HOME}/.dotfiles/external/zsh-completions/src/*" "${ZDOTDIR:-$HOME}/.dotfiles/zsh-comps/"
fi 
