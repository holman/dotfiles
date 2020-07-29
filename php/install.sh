if test $(command -v brew); then
  if test $(command -v composer); then
    echo 'Upgrading php & composer...'
    brew upgrade php composer
  else
    echo 'Installing php & composer ...'
    brew install php composer
  fi
fi
