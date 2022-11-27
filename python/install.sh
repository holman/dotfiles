#!/bin/sh

# avoid --user https://docs.brew.sh/Homebrew-and-Python
pip3 install -q --upgrade pip
pip3 install -q --upgrade setuptools
pipx install pipenv

CURRENT_DIRECTORY=$(pwd)
PYTHON_DIRECTORY="$DOTFILES_ROOT/python"
cd "$PYTHON_DIRECTORY" || {
  echo "change to python directory failed"
  exit
}
pipenv lock --pre
pipenv install --system
cd "$CURRENT_DIRECTORY" || {
  echo "change to original directory failed"
  exit
}
echo "finished installing global python packages"

pipx install black
pipx install flake8
pipx install isort
pipx install pre-commit
