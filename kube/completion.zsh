

source_if_exists() {
  if [[ -a $1 ]]
  then
    source $1
  fi
}
source_if_exists $HOME/.kube/completion.zsh.inc
source_if_exists $HOME/.kops/completion.zsh.inc
source_if_exists $HOME/.helm/completion.zsh.inc
source_if_exists $HOME/.minikube-completion
