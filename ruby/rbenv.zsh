# Use Homebrew's directories rather than ~/.rbenv (also per Homebrew's caveats)
export RBENV_ROOT=/usr/local/var/rbenv

# init according to man page
if (( $+commands[rbenv] ))
then
  eval "$(rbenv init -)"
fi
