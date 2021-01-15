if (( $+commands[kubectl] )); then

  __KUBECTL_COMPLETION_FILE="${ZSH_CACHE_DIR}/kubectl_completion"

  if [[ ! -f $__KUBECTL_COMPLETION_FILE ]]; then
    kubectl completion zsh >! $__KUBECTL_COMPLETION_FILE
  fi

  [[ -f $__KUBECTL_COMPLETION_FILE ]] && source $__KUBECTL_COMPLETION_FILE

  unset __KUBECTL_COMPLETION_FILE
fi

# this command is used a lot both below and in daily life
alias k=kubectl
alias compdef k="kubectl"
