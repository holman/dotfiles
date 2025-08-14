# Kubernetes aliases and shortcuts
alias k='kubectl'
alias kgp='kubectl get pods'
alias kgs='kubectl get services'
alias kgd='kubectl get deployments'
alias kgi='kubectl get ingress'
alias kgn='kubectl get nodes'
alias kga='kubectl get all'

# Kubernetes context and namespace
alias kctx='kubectx'
alias kns='kubens'
alias kcurrent='kubectl config current-context'
alias kconfig='kubectl config view'

# Kubernetes logs and debugging
alias klogs='kubectl logs'
alias klogsf='kubectl logs -f'
alias kdesc='kubectl describe'
alias kexec='kubectl exec -it'
alias kport='kubectl port-forward'

# Kubernetes apply/delete
alias kapply='kubectl apply -f'
alias kdelete='kubectl delete -f'
alias kdry='kubectl apply --dry-run=client -o yaml'

# Helm shortcuts
alias h='helm'
alias hls='helm list'
alias his='helm install'
alias hup='helm upgrade'
alias hun='helm uninstall'
alias hget='helm get'
alias hroll='helm rollback'

# K9s shortcut
alias k9='k9s'

# Quick cluster info
alias kcluster='kubectl cluster-info'
alias kversion='kubectl version --short'