# #!/bin/sh
#
# if test ! $(which rbenv)
# then
#   echo "  Installing rbenv for you."
#   brew install rbenv > /tmp/rbenv-install.log
# fi
#
# if test ! $(which ruby-build)
# then
#   echo "  Installing ruby-build for you."
#   brew install ruby-build > /tmp/ruby-build-install.log
# fi

if [[ ! -x "$(which rbenv)" ]]
then
  echo
  echo "Installing Ruby tools and Ruby 2.3.3"
  eval "$(rbenv init -)"
  rbenv install 2.5.1 --skip-existing
  rbenv global 2.5.1
  gem install bundler

  # this is for using vim in irb.
  gem install interactive_editor

  rbenv rehash
fi
