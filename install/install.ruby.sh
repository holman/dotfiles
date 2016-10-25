#!/usr/bin/env bash
echo "Installing ruby versions"

rbenv install 2.3.1
rbenv global 2.3.1

# gems should be installed by projects
# dont have a need for global gems

# gem install fastlane nokogiri