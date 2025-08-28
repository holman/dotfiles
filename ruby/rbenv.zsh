# fun: https://bugs.ruby-lang.org/issues/14009
export OBJC_DISABLE_INITIALIZE_FORK_SAFETY=YES

# init according to man page
if (( $+commands[rbenv] ))
then
  eval "$(rbenv init -)"
fi
