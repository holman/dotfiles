# #!/bin/sh

if [[ -x "$(which rbenv)" ]]
then
  echo
  echo "Installing Ruby tools and Ruby 2.6.5"
  eval "$(rbenv init -)"
  rbenv install 2.6.5 --skip-existing
  rbenv global 2.6.5
  gem install bundler

  # this is for using vim in irb.
  gem install interactive_editor

  rbenv rehash
fi
