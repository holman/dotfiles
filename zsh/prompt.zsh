# adds kube context
PROMPT=$PROMPT'$(kube_ps1) '$'\n'"$ "

# To customize prompt, run `p10k configure` or edit ~/.p10k.zsh.
[[ ! -f ~/.p10k.zsh ]] || source ~/.p10k.zsh
