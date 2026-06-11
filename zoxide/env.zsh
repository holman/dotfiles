# zoxide — a smarter `cd` that learns your most-used directories.
#   https://github.com/ajeetdsouza/zoxide
#
# Provides `z <query>` to jump to a directory and `zi` for an interactive
# (fzf-backed) picker. The init hook defines both.
if command -v zoxide &>/dev/null; then
  eval "$(zoxide init zsh)"
fi
