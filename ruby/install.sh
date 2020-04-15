if test $(command -v brew); then
  if test $(command -v rbenv); then
    echo 'Upgrading rbenv...'
    brew upgrade rbenv ruby-build
  else
    echo 'Installing rbenv ...'
    brew install rbenv ruby-build
  fi
  echo 'Installing latest stable ruby version'
  latest_version=$(rbenv install -l | awk -F '.' '
   /^[[:space:]]*[0-9]+\.[0-9]+\.[0-9]+[[:space:]]*$/ {
      if ( ($1 * 100 + $2) * 100 + $3 > Max ) {
         Max = ($1 * 100 + $2) * 100 + $3
         Version=$0
         }
      }
   END { print Version }')
  rbenv install $latest_version

  if [[ $(rbenv global) = *system* ]]; then
    rbenv global $latest_version
  fi

  echo 'Rehash rbenv and update rubygems'
  rbenv rehash
  gem update --system
fi
