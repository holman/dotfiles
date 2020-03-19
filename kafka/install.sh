if test $(which brew); then
  if test $(brew services list | grep -q kafka); then
    echo "  installing kafka"
    brew install kafka
  fi

  # https://www.telepresence.io/reference/install
  if test ! $(which telepresence); then
    echo "  installing telepresence"
    brew cask install osxfuse
    brew install datawire/blackbird/telepresence
  fi
fi