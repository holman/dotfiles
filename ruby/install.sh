#!/bin/sh

if test ! $(which rbenv); then
  pprint step "Installing rbenv for you"
  brew install rbenv > /tmp/rbenv-install.dot.log 2>&1

  if [[ $? != 0 ]]; then
    pprint error -r "Failed to install rbenv"
    errors=true
  fi
fi

if test ! $(which ruby-build); then
  pprint step "Installing ruby-build for you"
  brew install ruby-build > /tmp/ruby-build-install.dot.log 2>&1

  if [[ $? != 0 ]]; then
    pprint error -r "Failed to install ruby-build"
    errors=true
  fi
fi

if [[ $errors == "true"]]; then
	exit 1
fi

pprint ok "Ruby is properly installed"
exit 0
