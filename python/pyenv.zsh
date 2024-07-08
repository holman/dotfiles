# init according to man page
if (( $+commands[pybenv] ))
then
  eval "$(pybenv init - zsh)"
fi
