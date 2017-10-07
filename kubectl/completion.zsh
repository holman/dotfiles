if (( ! $+commands[kubectl] ))
then
 return 0;
fi
source <(kubectl completion zsh)
