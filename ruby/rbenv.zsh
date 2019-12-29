# init according to man page
if (( $+commands[rbenv] ))
then
  export OBJC_DISABLE_INITIALIZE_FORK_SAFETY=YES
  eval "$(rbenv init - zsh)"
  eval "$(rbenv init -)"
fi
