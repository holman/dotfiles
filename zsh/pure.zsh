fpath=( "$HOME/.zfunctions" $fpath )
autoload -U promptinit; promptinit

# optionally define some options
PURE_CMD_MAX_EXEC_TIME=10

# Safer symbols
PURE_PROMPT_SYMBOL='»'
PURE_GIT_DOWN_ARROW='↑'
PURE_GIT_UP_ARROW='↓'

VIM_PROMPT="»"
PROMPT='%(?.%F{magenta}.%F{red})${VIM_PROMPT}%f '

prompt_pure_update_vim_prompt() {
   zle || {
      print "error: pure_update_vim_prompt must be called when zle is active"
      return 1
   }
   VIM_PROMPT=${${KEYMAP/vicmd/❮}/(main|viins)/❯}
   zle .reset-prompt
}

function zle-line-init zle-keymap-select {
   prompt_pure_update_vim_prompt
}

zle -N zle-line-init
zle -N zle-keymap-select

#Put time in before prompt
RPROMPT='%F{white}%*'

prompt pure
