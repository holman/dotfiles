#!/usr/bin/env bash
#
# Install kubectl and related packages

set -o errexit -o nounset -o pipefail

source "${DOTFILES}/functions/core"

if [[ "${ENVIRONMENT}" != ACS ]]; then
  info "Installing kubectl"
  (
    cd "$(mktemp -d)" &&
    curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl" &&
    curl -LO "https://dl.k8s.io/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl.sha256" &&
    echo "$(cat kubectl.sha256)  kubectl" | sha256sum --check &&
    sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
  )
  success "kubectl installed OK"
fi

info "Installing krew and plugins"
(
  cd "$(mktemp -d)" &&
  OS="$(uname | tr '[:upper:]' '[:lower:]')" &&
  ARCH="$(uname -m | sed -e 's/x86_64/amd64/' -e 's/\(arm\)\(64\)\?.*/\1\2/' -e 's/aarch64$/arm64/')" &&
  KREW="krew-${OS}_${ARCH}" &&
  curl -fsSLO "https://github.com/kubernetes-sigs/krew/releases/latest/download/${KREW}.tar.gz" &&
  tar zxvf "${KREW}.tar.gz" &&
  ./"${KREW}" install krew
)

# setting path locally here as well to allow plugins installation
export PATH="${KREW_ROOT:-$HOME/.krew}/bin:$PATH"

kubectl krew install ctx
kubectl krew install iexec
kubectl krew install images
kubectl krew install kuttl
kubectl krew install ns
kubectl krew install tree

(
  VERSION_K9S=v0.26.7
  cd "$(mktemp -d)"
  curl -LO https://github.com/derailed/k9s/releases/download/${VERSION_K9S}/k9s_Linux_x86_64.tar.gz
  tar xzvf k9s_Linux_x86_64.tar.gz
  mv k9s ${HOME}/bin
)

success "Krew and plugins installed OK"

