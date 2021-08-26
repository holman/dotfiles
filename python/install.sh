#!/bin/bash
#
# pyenv
#
# This installs pyenv and some of the most popular python versions.

# Check for pyenv
if test ! "$(which pyenv)"; then
    if test "$(which brew)"; then
        echo "Installing pyenv for you."
        brew install pyenv
        eval "$(pyenv init --path)"
        if ! pyenv versions | grep -q "3.9"; then
            default_version="3.9.0"
            python_version=$(pyenv install -l | grep "3.9" | tr -d " " | grep -v "[a-zA-Z]" | tail -n 1)
            version_to_install="${python_version:-$default_version}"
            echo "Installing python version $version_to_install"
            pyenv install "$version_to_install"
            echo "Setting global python version to $version_to_install"
            pyenv global "$version_to_install"
        fi
    else
        echo "brew is not installed - skipping installation of pyenv"
    fi
fi

exit 0
