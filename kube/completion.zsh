

source_if_exists() {
  if [[ -a $1 ]]
  then
    source $1
  fi
}
if [ -x "$(command -v kubectl)" ]; then
  source <(kubectl completion zsh)
  complete -F __start_kubectl kc
fi

if [ -x "$(command -v kops)" ]; then
  source <(kops completion zsh)
fi

if [ -x "$(command -v helm)" ]; then
  source <(helm completion zsh)
fi

# source_if_exists $HOME/.kube/completion.zsh.inc
# source_if_exists $HOME/.kops/completion.zsh.inc
# source_if_exists $HOME/.helm/completion.zsh.inc
# source_if_exists $HOME/.minikube-completion
 