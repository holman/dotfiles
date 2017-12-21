if [[ ! -s "$HOME/.zfunctions" ]]; then
  mkdir "$HOME/.zfunctions"
fi

if [[ -s "${ZDOTDIR:-$HOME}/.dotfiles/external/pure/pure.zsh" ]]; then
  ln -s "${ZDOTDIR:-$HOME}/.dotfiles/external/pure/pure.zsh" "$HOME/.zfunctions/prompt_pure_setup"
fi

if [[ -s "${ZDOTDIR:-$HOME}/.dotfiles/external/pure/async.zsh" ]]; then
  ln -s "${ZDOTDIR:-$HOME}/.dotfiles/external/pure/async.zsh" "$HOME/.zfunctions/async"
fi

if [[ -d "${ZDOTDIR:-$HOME}/.dotfiles/external/zsh-completions/src" ]]; then
  ln -s "${ZDOTDIR:-$HOME}/.dotfiles/external/zsh-completions/src/*" "$HOME/.zfunctions/"
fi 
