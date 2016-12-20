if [[ ! -x "$(which rbenv)" ]]
then
  echo
  echo "Installing Ruby tools and Ruby 2.3.3"
  eval "$(rbenv init -)"
  rbenv install 2.3.3 --skip-existing
  rbenv global 2.3.3
  gem install bundler
  rbenv rehash
fi