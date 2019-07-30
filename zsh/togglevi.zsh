# http://chneukirchen.org/blog/archive/2012/02/10-new-zsh-tricks-you-may-not-know.html
foreground-vi() {
  restore_vim_title
  fg %?vi
  precmd
  zle redisplay
}
zle -N foreground-vi
bindkey '^Z' foreground-vi

function is-vi-suspended() {
  jobs %?vim  &> /dev/null
}
