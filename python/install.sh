if test $(command -v brew); then
  if test $(python3 -V | grep -q 'Python 3'); then
    echo "   installing python"
    brew install python
  else
    echo " upgrading python"
    brew upgrade python
  fi

  # https://installvirtual.com/how-to-install-python-3-8-on-mac-using-pyenv/
  if test ! $(command -v pyenv); then
    echo "  installing pyenv"
    brew install pyenv
  else
    echo "  upgrading pyenv"
    brew upgrade pyenv
  fi

  # install python 3.8
  # https://installvirtual.com/how-to-install-python-3-8-on-mac-using-pyenv/
  if test $(pyenv versions | grep -q 3.8); then
    echo "  installing python 3.8.0"
    pyenv install 3.8.0
  else
    echo "  python 3.8 already installed"
  fi
  echo '  setting python 3.8 to be global'
  pyenv global 3.8.0

  if test ! $(command -v cookiecutter); then
    echo "  Installing cookiecutter"
    brew install cookiecutter
  fi

  if test ! $(command -v poetry); then
    echo "  Installing poetry & black"
    curl -sSL https://raw.githubusercontent.com/sdispater/poetry/master/get-poetry.py | python
    poetry add -D --allow-prereleases black
  fi
fi