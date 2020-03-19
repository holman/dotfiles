# from: https://matthewpalmer.net/kubernetes-app-developer/articles/guide-install-kubernetes-mac.html
if test $(which brew); then
  if test ! $(which kubectl); then
    echo "  installing kubectl"
    brew install kubectl
  fi
fi