# >>> conda initialize >>>
# !! Contents within this block are managed by 'conda init' !!
__conda_setup="$($CONDA_HOME 'shell.zsh' 'hook' 2> /dev/null)"
if [ $? -eq 0 ]; then
    eval "$__conda_setup"
else
    if [ -f "$CONDA_HOME/etc/profile.d/conda.sh" ]; then
        . "$CONDA_HOME/etc/profile.d/conda.sh"
#    else
#        export PATH="$CONDA_HOME:$PATH"
    fi
fi
unset __conda_setup
# <<< conda initialize <<<