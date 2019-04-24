# GRC colorizes nifty unix tools all over the place
if (( $+commands[grc] )) && (( $+commands[brew] ))
then
  brew_prefix="/usr/local"
  if [ ! -d "${brew_prefix}" ]; then
    brew_prefix="$(brew --prefix)"
  fi
  source "${brew_prefix}/etc/grc.bashrc"
fi
