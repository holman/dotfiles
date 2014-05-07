# http://chneukirchen.org/blog/archive/2012/02/10-new-zsh-tricks-you-may-not-know.html
foreground-vi() {
  fg %?vi
  zle redisplay
}
zle -N foreground-vi
bindkey '^Z' foreground-vi
