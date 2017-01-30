export LSCOLORS="exfxcxdxbxegedabagacad"
export CLICOLOR=1
export NVM_NO_USE=true
export NVM_AUTO_USE=true
export OS=`uname`
export HOSTNAME="`hostname`"

fpath=($ZSH/functions $fpath)

autoload -U $ZSH/functions/*(:t)

HISTFILE=~/.zhistory
HISTSIZE=10000
SAVEHIST=10000
PAGER='more'

setopt NO_BG_NICE # don't nice background tasks
setopt NO_HUP
setopt NO_LIST_BEEP
setopt LOCAL_OPTIONS # allow functions to have local options
setopt LOCAL_TRAPS # allow functions to have local traps
setopt HIST_VERIFY
setopt SHARE_HISTORY # share history between sessions ???
setopt EXTENDED_HISTORY # add timestamps to history
setopt PROMPT_SUBST
setopt CORRECT
setopt COMPLETE_IN_WORD
setopt IGNORE_EOF
setopt MENUCOMPLETE

setopt APPEND_HISTORY # adds history
setopt INC_APPEND_HISTORY SHARE_HISTORY  # adds history incrementally and share it across sessions
setopt HIST_IGNORE_ALL_DUPS  # don't record dupes in history
setopt HIST_REDUCE_BLANKS

setopt   notify globdots pushdtohome cdablevars autolist
setopt   correctall autocd recexact longlistjobs
setopt   autoresume pushdsilent
setopt   autopushd pushdminus extendedglob rcquotes mailwarning

# don't expand aliases _before_ completion has finished
#   like: git comm-[tab]
setopt complete_aliases

bindkey -v
bindkey '^[^[[D' backward-word
bindkey '^[^[[C' forward-word
bindkey '^[[5D' beginning-of-line
bindkey '^[[5C' end-of-line
bindkey '^[[3~' delete-char
bindkey '^?' backward-delete-char

bindkey '^[OH' beginning-of-line
#bindkey '^[OF' end-of-line
bindkey '^[[5~' up-line-or-history
bindkey '^[[6~' down-line-or-history
bindkey "^r" history-incremental-search-backward
bindkey ' ' magic-space    # also do history expansion on space
bindkey '^I' complete-word # complete on tab, leave expansion to _expand
