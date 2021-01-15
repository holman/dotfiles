if (( $+commands[istioctl] )); then

  __ISTIOCTL_COMPLETION_FILE="${ZSH_CACHE_DIR}/istioctl_completion"

  if [[ ! -f $__ISTIOCTL_COMPLETION_FILE ]]; then
    mkdir -p $__ISTIOCTL_COMPLETION_FILE
    istioctl collateral completion --zsh -o $__ISTIOCTL_COMPLETION_FILE
  fi

  [[ -f $__ISTIOCTL_COMPLETION_FILE ]] && source $__ISTIOCTL_COMPLETION_FILE

  unset __ISTIOCTL_COMPLETION_FILE
fi
