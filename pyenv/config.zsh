# for some reason adding pyenv in PATH is not recognized in this eval statement
# calling pyenv & pyenv-virtualenv-init directly from homebrew install location
eval "$(/usr/local/bin/pyenv init -)"
eval "$(/usr/local/bin/pyenv-virtualenv-init -)"

