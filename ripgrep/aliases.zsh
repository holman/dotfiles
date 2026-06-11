# ripgrep — a fast, .gitignore-aware `grep`.
#   https://github.com/BurntSushi/ripgrep
#
# Note: rg's flags differ from grep's. This alias is intentional per personal
# preference; reach for `command grep` (or `\grep`) when you need POSIX grep.
if command -v rg &>/dev/null; then
  alias grep='rg'
fi
