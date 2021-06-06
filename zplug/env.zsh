export ZPLUG_HOME=/usr/local/opt/zplug
source $ZPLUG_HOME/init.zsh

zplug "plugins/docker", from:oh-my-zsh
zplug "plugins/nvm", from:oh-my-zsh
#ZSH_TMUX_AUTOSTART='true'
zplug "plugins/tmux", from:oh-my-zsh
zplug "mfaerevaag/wd"
zplug "zsh-users/zsh-syntax-highlighting"
zplug "zsh-users/zsh-completions"
zplug "zsh-users/zsh-autosuggestions"

#Theme
source $ZSH/zsh/theme.sh
zplug "bhilburn/powerlevel9k", use:powerlevel9k.zsh-theme

if ! zplug check; then
    zplug install
fi

#if ! zplug status; then
#    zplug update
#fi


zplug load
