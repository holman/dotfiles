# append all cluster configs to KUBECONFIG
for config in $HOME/.kube/clusters/*; do
  KUBECONFIG=$KUBECONFIG:$config
done
KUBECONFIG=${KUBECONFIG#:}
export KUBECONFIG
