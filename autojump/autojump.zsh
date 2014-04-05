# autojump
if [ "$(uname)" = "Darwin" ]; then
  [[ -s `brew --prefix`/etc/autojump.sh ]] && . `brew --prefix`/etc/autojump.sh
elif [ "$(lsb_release -i)" = "Distributor ID: Ubuntu" ]; then
  zsh_file="$(dpkg -L autojump | grep "autojump.zsh")"
  source $zshfile
fi
