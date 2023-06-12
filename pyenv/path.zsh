export PYENV_ROOT="$HOME/.pyenv"
# According to pyenv README, we need to add this but `.pyenv/bin` doesn't exist and seems
# to work perfectly fine without adding this. Others have noted similar results. Leaving here
# until documentation updates or a fix has been pushed for pyenv
export PATH="$PYENV_ROOT/bin":$PATH
