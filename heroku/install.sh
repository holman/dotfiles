if test ! $(command -v heroku); then
  echo "  Installing Homebrew for you."
  brew tap heroku/brew && brew install heroku
fi
