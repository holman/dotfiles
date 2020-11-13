export LSCOLORS="exfxcxdxbxegedabagacad"
export CLICOLOR=true

fpath=($DOTFILES/functions $fpath)

autoload -U $DOTFILES/functions/*(:t)

setopt CORRECT
setopt COMPLETE_IN_WORD
setopt IGNORE_EOF
setopt LOCAL_OPTIONS # allow functions to have local options
setopt LOCAL_TRAPS   # allow functions to have local traps
setopt PROMPT_SUBST  # parameter expansion, command substitution and arithmetic expansion are performed in prompts. Substitutions within prompts do not affect the command status.
setopt NO_BG_NICE    # don't nice background tasks
setopt NO_HUP
setopt NO_LIST_BEEP

HISTFILE=~/.zsh_history
HISTSIZE=100000
SAVEHIST=100000

setopt APPEND_HISTORY     # adds history
setopt EXTENDED_HISTORY   # add timestamps to history format ‘: <beginning time>:<elapsed seconds>;<command>’.
setopt INC_APPEND_HISTORY # adds history incrementally
setopt SHARE_HISTORY      # share it across sessions
setopt HIST_IGNORE_DUPS   # Do not enter command lines into the history list if they are duplicates of the previous event.
setopt HIST_VERIFY        # Whenever the user enters a line with history expansion, don’t execute the line directly; instead, perform history expansion and reload the line into the editing buffer.
setopt HIST_REDUCE_BLANKS # Remove superfluous blanks from each command line being added to the history list
setopt HIST_IGNORE_SPACE  # don't add commands starting with space

# don't expand aliases _before_ completion has finished
#   like: git comm-[tab]
# https://stackoverflow.com/a/20643204
# setopt complete_aliases

# http://zshwiki.org/home/
# https://stackoverflow.com/questions/18042685/list-of-zsh-bindkey-commands
# http://zsh.sourceforge.net/Doc/Release/Zsh-Line-Editor.html#Movement
bindkey '^[^[[D' backward-word    # control-left conflicts with spaces
bindkey '^[^[[C' forward-word     # control-right conflicts with spaces
bindkey '^[[H' beginning-of-line  # home-key
bindkey '^[[F' end-of-line        # end-key
bindkey '^[[3~' delete-char       # del-key
bindkey '^?' backward-delete-char # backspace-key
