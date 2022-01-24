# init according to man page
export RBENV_ROOT="$HOME/.rbenv"
export PATH="$RBENV_ROOT/shims:$PATH"
if (( $+commands[rbenv] ))
then
  eval "$(rbenv init -)"
fi
