export DOKKU_DIR="${HOME}/.dokku"
alias dokku='bash $DOKKU_DIR/dokku_client.sh'


# Small hack to set the env var DOKKU_HOST to the dokku@hostname of the entering file
# I don't want to name my remote dokku.
autoload -U add-zsh-hook
load-dokku-remote() {
    if [[ -d .git ]] || git rev-parse --git-dir > /dev/null 2>&1; then
      set +e
      export DOKKU_HOST=$(git remote -v 2>/dev/null | grep -Ei "dokku@" | head -n 1 | cut -f2 -d'@' | cut -f1 -d' ' | cut -f1 -d':' 2>/dev/null)
      set -e
  fi
}
add-zsh-hook chpwd load-dokku-remote
load-dokku-remote
