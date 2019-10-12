# Idea from https://babushk.in/posts/renew-environment-tmux.html
function _refresh_envvariable_from_tmux() {
  export $(tmux show-environment | grep "^$1") &> /dev/null
}

function refresh_environment() {
  _refresh_envvariable_from_tmux "SSH_AUTH_SOCK"
  _refresh_envvariable_from_tmux "DISPLAY"
  _refresh_envvariable_from_tmux "COLORFGBG"
}
