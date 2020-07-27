# If pyenv exists then have to take over Python versions

if which pyenv > /dev/null; then 
  eval "$(pyenv init -)"; 
fi
pyenv virtualenvwrapper_lazy

# Disables the prompt changes
export PYENV_VIRTUALENV_DISABLE_PROMPT=1
