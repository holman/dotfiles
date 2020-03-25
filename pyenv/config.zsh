# If pyenv exists then have to take over Python versions

if which pyenv > /dev/null; then 
  eval "$(pyenv init -)"; 
fi
pyenv virtualenvwrapper_lazy
