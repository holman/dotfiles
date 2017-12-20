if [[ -s "${ZDOTDIR:-$HOME}/.dotfiles/external/pure/pure.zsh" ]]; then
  ln -s "${ZDOTDIR:-$HOME}/.dotfiles/external/pure/pure.zsh" "${ZDOTDIR:-$HOME}/.dotfiles/pure/prompt_pure_setup"
fi

if [[ -s "${ZDOTDIR:-$HOME}/.dotfiles/external/pure/async.zsh" ]]; then
  ln -s "${ZDOTDIR:-$HOME}/.dotfiles/external/pure/async.zsh" "${ZDOTDIR:-$HOME}/.dotfiles/pure/async"
fi
