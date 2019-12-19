kubes-switch(){
  local kube_path="$HOME/.kube/$1"
  if [ -f $kube_path ]; then
    echo "using $HOME/.kube/$1"
    ln -sf $kube_path ~/.kube/config
  else
    echo "cannot find config::: $kube_path"
  fi
}

kubes-list(){
  ls -alh $HOME/.kube
}
