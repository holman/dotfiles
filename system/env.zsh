if quiet_which code
then
  export EDITOR="code"
  export GIT_EDITOR="$EDITOR -w"
elif quiet_which vim
then
  export EDITOR="vim"
elif quiet_which vi
then
  export EDITOR="vi"
fi
