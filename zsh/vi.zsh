# Vi mode
#bindkey -v
zstyle ':completion:*' menu select

zmodload zsh/complist
# Group results by category
zstyle ':completion:*' group-name ''

# use the vi navigation keys in menu completion
bindkey -M menuselect 'h' vi-backward-char
bindkey -M menuselect 'k' vi-up-line-or-history
bindkey -M menuselect 'l' vi-forward-char
bindkey -M menuselect 'j' vi-down-line-or-history
