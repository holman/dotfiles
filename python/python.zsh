# disallow usage of pip without active virtualenv
export PIP_REQUIRE_VIRTUALENV=true

# activate our default python virtualenv
source ~/.virtualenv/neo/bin/activate

# init according to man page
if (( $+commands[pyenv] ))
then
  eval "$(pyenv init -)"
fi
