# Z integration with FZF
# . /usr/local/etc/profile.d/z.sh
. /opt/homebrew/etc/profile.d/z.sh

unalias z 2> /dev/null
z() {
  [ $# -gt 0 ] && _z "$*" && return
  cd "$(_z -l 2>&1 | fzf --height 40% --reverse +s --tac --query "$*" | sed 's/^[0-9,.]* *//')"
}
