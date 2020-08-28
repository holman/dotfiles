if test ! $(command -v aws); then
  echo "  Installing Homebrew for you."
  brew install awscli
fi
