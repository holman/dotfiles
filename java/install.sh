#!/usr/bin/env bash

# SDKMAN installation and configuration script
set -euo pipefail
IFS=$'\n\t'

# Output formatting
info() { printf "\r\033[2K  [\033[00;34mINFO\033[0m] %s\n" "$1"; }
success() { printf "\r\033[2K  [\033[00;32m OK \033[0m] %s\n" "$1"; }
fail() { printf "\r\033[2K  [\033[0;31mFAIL\033[0m] %s\n" "$1"; exit 1; }


SDKMAN_DIR="$HOME/.sdkman"

# Check if SDKMAN is already installed
if [[ ! -d "$SDKMAN_DIR" ]]; then
    info "Installing SDKMAN..."
    # Install SDKMAN
    curl -s "https://get.sdkman.io" | bash

    source "$HOME/.sdkman/bin/sdkman-init.sh"

    success "SDKMAN installed successfully"
else
    info "SDKMAN is already installed"
fi

# Install default Java version if not already installed
JAVA_VERSION="17.0.7-amzn"

if ! sdk list java | grep -q "$JAVA_VERSION"; then
    info "Installing Java $JAVA_VERSION..."
    sdk install java "$JAVA_VERSION"
    success "Java $JAVA_VERSION installed"
else
    info "Java $JAVA_VERSION is already installed"
fi

# Set default Java version
info "Setting Java $JAVA_VERSION as default..."
sdk default java "$JAVA_VERSION"
success "Java $JAVA_VERSION set as default"

# Verify installation
if command -v java >/dev/null 2>&1; then
    INSTALLED_VERSION=$(java -version 2>&1 | head -n 1)
    success "Java installation verified: $INSTALLED_VERSION"
else
    fail "Java installation could not be verified"
fi

# Export JAVA_HOME in current session
export JAVA_HOME="$(sdk home java $JAVA_VERSION)"
success "JAVA_HOME set to $JAVA_HOME"
