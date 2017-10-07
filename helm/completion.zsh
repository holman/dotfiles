if (( ! $+commands[helm] ))
then
 return 0;
fi
source <(helm completion zsh)
