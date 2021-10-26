#!/bin/bash -e
if [ "$(uname)" == "Darwin" ]; then
  source $DOTS/common/brew.sh
  brew_install ripgrep
elif [[ "$(lsb_release -i)" == *"Ubuntu"* ]]; then
  source $DOTS/common/apt.sh
  apt_install curl
  tmpfile=$(mktemp)
  trap "rm -rf ${tmpfile}" EXIT
  curl -Lo "${tmpfile}" https://github.com/BurntSushi/ripgrep/releases/download/13.0.0/ripgrep_13.0.0_amd64.deb
  expect_hash="95e37f20c20cae79338cc040697a7dc4113891e8"
  actual_hash="$(sha1sum ${tmpfile} | cut -d' ' -f 1)"
  if [[ "$expect_hash" != "$actual_hash" ]]; then
    echo "sha1sum mismatch for ripgrep. Aborting."
    exit 1
  fi
  sudo dpkg -i "${tmpfile}"
fi
