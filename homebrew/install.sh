#!/bin/sh
#
# Homebrew
#
# This installs some of the common dependencies needed (or at least desired)
# using Homebrew.

# Install homebrew packages
for package in ("grc" "coreutils" "spark")
do
  info "Installing $package"
  if brew install $package > /tmp/dot-upgrade
  then
    success "Installed $package"
  else
    fail "Failed to install $package"
  fi
done

exit 0