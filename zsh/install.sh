if [[ ! -s "$HOME/.zprompt" ]]; then
  mkdir "$HOME/.zprompt"
fi

if [[ -s "${ZDOTDIR:-$HOME}/.dotfiles/external/pure/pure.zsh" ]]; then
  ln -s "${ZDOTDIR:-$HOME}/.dotfiles/external/pure/pure.zsh" "$HOME/.zprompt/prompt_pure_setup"
fi

if [[ -s "${ZDOTDIR:-$HOME}/.dotfiles/external/pure/async.zsh" ]]; then
  ln -s "${ZDOTDIR:-$HOME}/.dotfiles/external/pure/async.zsh" "$HOME/.zprompt/async"
fi
