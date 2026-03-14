_brew_cache="$HOME/.cache/brew-shellenv.sh"

if [[ -x /opt/homebrew/bin/brew ]]; then
  _brew=/opt/homebrew/bin/brew
elif [[ -x /home/linuxbrew/.linuxbrew/bin/brew ]]; then
  _brew=/home/linuxbrew/.linuxbrew/bin/brew
else
  _brew=""
fi

if [[ -n "$_brew" ]]; then
  if [[ ! -f "$_brew_cache" || "$_brew" -nt "$_brew_cache" ]]; then
    mkdir -p "${_brew_cache:h}"
    "$_brew" shellenv >| "$_brew_cache"
  fi
  source "$_brew_cache"
fi

unset _brew _brew_cache

