export LSCOLORS="exfxcxdxbxegedabagacad"
export CLICOLOR=true

fpath=($ZSH/functions $fpath)

autoload -U $ZSH/functions/*(:t)

HISTFILE=~/.zsh_history
HISTSIZE=10000
SAVEHIST=10000

setopt NO_BG_NICE # don't nice background tasks
setopt NO_HUP
setopt NO_LIST_BEEP
setopt LOCAL_OPTIONS # allow functions to have local options
setopt LOCAL_TRAPS # allow functions to have local traps
setopt PROMPT_SUBST
setopt CORRECT
setopt COMPLETE_IN_WORD
setopt IGNOREEOF # don't exit on Ctrl+D 
setopt HIST_VERIFY
setopt EXTENDED_HISTORY # add timestamps to history
setopt APPEND_HISTORY # adds history
setopt INC_APPEND_HISTORY # adds history incrementally
setopt SHARE_HISTORY # share history between sessions
setopt HIST_IGNORE_ALL_DUPS # don't record dupes in history
setopt HIST_REDUCE_BLANKS
setopt auto_cd 
setopt auto_pushd
setopt pushd_ignore_dups

# don't expand aliases _before_ completion has finished
#   like: git comm-[tab]
setopt complete_aliases

autoload -Uz select-word-style
select-word-style default
zstyle ':zle:*' word-chars "_-./;@"
zstyle ':zle:*' word-style unspecified

bindkey '^[^[[D' backward-word
bindkey '^[^[[C' forward-word
bindkey '^[[5D' beginning-of-line
bindkey '^[[5C' end-of-line
bindkey '^[[3~' delete-char
bindkey '^?' backward-delete-char
bindkey '^r' history-incremental-pattern-search-backward
bindkey '^s' history-incremental-pattern-search-forward

autoload -Uz history-search-end
zle -N history-beginning-search-backward-end history-search-end
zle -N history-beginning-search-forward-end history-search-end
bindkey "^p" history-beginning-search-backward-end
bindkey "^n" history-beginning-search-forward-end

# bindings for custom functions
zle -N cdrepo
bindkey '^@' cdrepo

cdpath=(~)