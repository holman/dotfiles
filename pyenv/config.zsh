#command -v pyenv >/dev/null || export PATH="$PYENV_ROOT/bin:$PATH"
#if (( $+commands[pyenv] )); then
#  echo "initting pyenv inside"
#  eval "$(pyenv init -)"
#fi
echo "initting pyenv inside"
eval "$(/usr/local/bin/pyenv init -)"