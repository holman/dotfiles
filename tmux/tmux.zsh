# Idea from https://babushk.in/posts/renew-environment-tmux.html
function _refresh_envvariable_from_tmux() {
  # Update *all* environment variables
  # This is an expensive call we want to only do _once_ per preexec()
  export $(tmux show-environment) &> /dev/null
}

