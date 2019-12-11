if test ! $(which cookiecutter); then
  echo "  Installing cookiecutter"
  brew install cookiecutter
fi

if test ! $(which poetry); then
  echo "  Installing poetry & black"
  curl -sSL https://raw.githubusercontent.com/sdispater/poetry/master/get-poetry.py | python
  poetry add -D --allow-prereleases black
fi