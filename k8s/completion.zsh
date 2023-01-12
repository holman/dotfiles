source <(kubectl completion zsh)

# normally this shall establish the completion of the kubectl with `k` alias,
# but it does not work for neither (WSL / ACS) of the zsh
compdef _kubectl k
# if you want to debug further the reason why completion for `k` alias does not work
# export BASH_COMP_DEBUG_FILE=~/BASH_COMP_DEBUG_FILE

