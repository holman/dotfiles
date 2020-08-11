#!/usr/bin/env bash
set -e

if [ "$(uname)" == "Linux" ]; then
  echo "Adding Hashicorp GPG apt-key. Sudo required"
  cat hashicorp-apt-gpg.txt | sudo apt-key add -

  echo "Adding Hashicorp apt repo. Sudo required"
  sudo apt-add-repository "deb [arch=amd64] https://apt.releases.hashicorp.com $(lsb_release -cs) main"

  # This exists here and not in the Aptfile because the isntall.sh scripts require tools in Aptfile
  # Where this one requires the install.sh to run first. Not the best
  sudo apt-get update && sudo apt-get install terraform
fi

