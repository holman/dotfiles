bindkey -v
#bindkey "^[[A" history-search-backward
#bindkey "^[[B" history-search-forward
bindkey "\e[A" history-beginning-search-backward
bindkey "\e[B" history-beginning-search-forward
bindkey -M vicmd 'k' history-beginning-search-backward
bindkey -M vicmd 'j' history-beginning-search-forward

bindkey -M vicmd 'v' edit-command-line
