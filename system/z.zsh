. $ZSH/system/z/z.sh
function precmd () {
  _z --add "$(pwd -P)"
}