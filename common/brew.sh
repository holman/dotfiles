function ensure_brew_installed() {
  if test ! "$(which brew)"
  then
    echo "  Installing Homebrew for you."
    ruby -e "$(curl -fsSL https://raw.github.com/Homebrew/homebrew/go/install)" > /tmp/homebrew-install.log
  fi
}

function brew_install() {
  ensure_brew_installed
  # Install and upgrade if already installed
  # This saves us from one gigantic brew upgrade that also updates stuff we did not install from dotfiles
  brew install "$@"
  brew upgrade "$@"
}
