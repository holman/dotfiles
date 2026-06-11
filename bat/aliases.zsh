# bat — `cat` with syntax highlighting and Git integration.
#   https://github.com/sharkdp/bat
#
# bat detects when its output is piped and behaves like plain `cat` there, so
# aliasing `cat` is safe in scripts and pipelines.
if command -v bat &>/dev/null; then
  alias cat='bat'

  # Use bat as the pager for `--help` output and man pages.
  export MANPAGER="sh -c 'col -bx | bat -l man -p'"
fi
