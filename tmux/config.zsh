unsetopt auto_cd
# Proudly stolen from Chris Toomey's dotfiles
cdpath=(
  $HOME/code/work \
  $HOME/code/personal
)

tm-select-session() {
  project=$(projects | fzf --reverse)
  if [ ! -z "$project" ]; then
    (cd "$project" && tat)
  fi
}

_not_inside_tmux() { [[ -z "$TMUX" ]] }

ensure_tmux_is_running() {
  if _not_inside_tmux; then
    tat
  fi
}

_cdpath_directories() {
  modified_in_last_days=${1:-999}
  echo "${CDPATH//:/\n}" | while read dir; do
    find -L "$dir" \
      -not -path '*/\.*' \
      -type d \
      -atime -"$modified_in_last_days" \
      -maxdepth 5
  done
}

_is_a_git_repo() {
  while read dir; do
    if [[ -d "$dir/.git" ]]; then
      basename "$dir"
    fi
  done
}

projects() {
  _cdpath_directories $1 | _is_a_git_repo
}

# Experimental
# From wincent : https://github.com/wincent/wincent/roles/dotfiles/files/.zsh/functions#L41-L80
function tmux() {
  emulate -L zsh

  # Make sure even pre-existing tmux sessions use the latest SSH_AUTH_SOCK.
  # (Inspired by: https://gist.github.com/lann/6771001)
  local SOCK_SYMLINK=~/.ssh/ssh_auth_sock
  if [ -r "$SSH_AUTH_SOCK" -a ! -L "$SSH_AUTH_SOCK" ]; then
    ln -sf "$SSH_AUTH_SOCK" $SOCK_SYMLINK
  fi

  # If provided with args, pass them through.
  if [[ -n "$@" ]]; then
    env SSH_AUTH_SOCK=$SOCK_SYMLINK tmux "$@"
    return
  fi

  # Check for .tmux file (poor man's Tmuxinator).
  if [ -x .tmux ]; then
    # Prompt the first time we see a given .tmux file before running it.
    local DIGEST="$(openssl sha -sha512 .tmux)"
    if ! grep -q "$DIGEST" ~/..tmux.digests 2> /dev/null; then
      cat .tmux
      read -k 1 -r \
        'REPLY?Trust (and run) this .tmux file? (t = trust, otherwise = skip) '
      echo
      if [[ $REPLY =~ ^[Tt]$ ]]; then
        echo "$DIGEST" >> ~/..tmux.digests
        ./.tmux
        return
      fi
    else
      ./.tmux
      return
    fi
  fi

  # Attach to existing session, or create one, based on current directory.
  SESSION_NAME=$(basename "$(pwd)")
  env SSH_AUTH_SOCK=$SOCK_SYMLINK tmux new -A -s "$SESSION_NAME"
}
# ensure_tmux_is_running
