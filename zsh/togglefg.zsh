# Toggle suspended process with CTRL-Z
# http://serverfault.com/questions/225817/toggle-foreground-process
# by osdyng
# Thanks!
ctrlz () {
  if [[ $#BUFFER -eq 0 ]]; then
    fg
    zle redisplay
  else
    zle push-input
  fi
}
zle -N ctrlz
bindkey '^Z' ctrlz
