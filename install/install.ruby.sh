#!/usr/bin/env bash
source ./install/utils.sh

info "installing ruby versions"

# only install if not found
if ! rbenv versions | grep 2.3.1
then
	rbenv install 2.3.1
fi

rbenv global 2.3.1

# gems should be installed by projects
# dont have a need for global gems

# gem install fastlane nokogiri