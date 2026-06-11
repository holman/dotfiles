# eza — a modern, colorful replacement for `ls`.
#   https://github.com/eza-community/eza
#
# When eza is installed these take over ls/ll/la. The GNU `gls` fallbacks in
# system/aliases.zsh are skipped while eza is present, so load order is safe.
if command -v eza &>/dev/null; then
  alias ls='eza --group-directories-first --icons=auto'
  alias ll='eza -lah --group-directories-first --icons=auto --git'
  alias la='eza -a --group-directories-first --icons=auto'
  alias lt='eza --tree --level=2 --group-directories-first --icons=auto'
fi
