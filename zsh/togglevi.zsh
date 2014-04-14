# http://chneukirchen.org/blog/archive/2012/02/10-new-zsh-tricks-you-may-not-know.html
# http://serverfault.com/questions/225817/toggle-foreground-process
foreground-vi() {
  if [[ $#BUFFER -eq 0 ]]; then
    fg %?vi
    zle redisplay
  else
    zle push-input
  fi
}
zle -N foreground-vi
bindkey '^Z' foreground-vi
