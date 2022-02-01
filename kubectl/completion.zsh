if (( $+commands[kubectl] )); then

  if [[ -f ./kubectl_completion ]]; then
    source ./kubectl_completion
  else
    __KUBECTL_COMPLETION_FILE="${ZSH_CACHE_DIR}/kubectl_completion"

    if [[ ! -f $__KUBECTL_COMPLETION_FILE ]]; then
      kubectl completion zsh >! $__KUBECTL_COMPLETION_FILE
    fi
    [[ -f $__KUBECTL_COMPLETION_FILE ]] && source $__KUBECTL_COMPLETION_FILE
    unset __KUBECTL_COMPLETION_FILE
  fi
fi
