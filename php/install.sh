if test $(command -v brew); then
  if test $(command -v composer); then
    echo 'Upgrading php & composer...'
    brew upgrade php composer
  else
    echo 'Installing php & composer ...'
    brew install php composer
  fi

  if test $(command -v wp-cli); then
    echo 'Upgrade wp-cli'
    brew upgrade wp-cli
  else
    echo 'Installing wp-cli'
    brew install wp-cli
  fi
fi
