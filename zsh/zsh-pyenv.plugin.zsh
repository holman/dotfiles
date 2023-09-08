GITHUB="https://github.com"

[[ -z "$PYENV_HOME" ]] && export PYENV_HOME="$HOME/.pyenv"

# export PATH
export PATH="$PYENV_HOME/bin:$PATH"

_zsh_pyenv_install() {
    echo "Installing pyenv..."
    git clone "${GITHUB}/pyenv/pyenv.git"            "${PYENV_HOME}"
    git clone "${GITHUB}/pyenv/pyenv-doctor.git"     "${PYENV_HOME}/plugins/pyenv-doctor"
    git clone "${GITHUB}/pyenv/pyenv-installer.git"  "${PYENV_HOME}/plugins/pyenv-installer"
    git clone "${GITHUB}/pyenv/pyenv-update.git"     "${PYENV_HOME}/plugins/pyenv-update"
    git clone "${GITHUB}/pyenv/pyenv-virtualenv.git" "${PYENV_HOME}/plugins/pyenv-virtualenv"
    git clone "${GITHUB}/pyenv/pyenv-which-ext.git"  "${PYENV_HOME}/plugins/pyenv-which-ext"
}

_zsh_pyenv_load() {
    eval "$(pyenv init --path)"
    eval "$(pyenv init - --no-rehash zsh)"
    eval "$(pyenv virtualenv-init - zsh)"
}

# install pyenv if it isnt already installed
if ! command -v pyenv &>/dev/null; then
    _zsh_pyenv_install
fi

# load pyenv if it is installed
if command -v pyenv &>/dev/null; then
    _zsh_pyenv_load
fi