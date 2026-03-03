# GRC colorizes command output when available.
if (( $+commands[grc] )) && (( $+commands[brew] )); then
  grc_prefix="$(brew --prefix)"

  if [[ -f "$grc_prefix/etc/grc.zsh" ]]; then
    source "$grc_prefix/etc/grc.zsh"
  fi

  unset grc_prefix
fi
