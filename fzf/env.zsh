# fzf — command-line fuzzy finder, with zsh key bindings + completion.
#   https://github.com/junegunn/fzf
#
# Key bindings:
#   CTRL-R  search command history
#   CTRL-T  paste selected file/dir paths onto the command line
#   ALT-C   cd into a selected directory
if command -v fzf &>/dev/null; then
  # fzf >= 0.48 ships its shell integration via `fzf --zsh`.
  if fzf --zsh &>/dev/null; then
    source <(fzf --zsh)
  fi

  # Prefer ripgrep for the default file search when available (respects
  # .gitignore and is fast); fall back to fzf's built-in walker otherwise.
  if command -v rg &>/dev/null; then
    export FZF_DEFAULT_COMMAND='rg --files --hidden --glob "!.git/*"'
    export FZF_CTRL_T_COMMAND="$FZF_DEFAULT_COMMAND"
  fi

  export FZF_DEFAULT_OPTS='--height 40% --layout=reverse --border'
fi
