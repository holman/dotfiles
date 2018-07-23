minikube-docker() {
    #eval $(minikube docker-env)
    minikube docker-env > $HOME/.docker_env
    source $HOME/.docker_env
}


function docker_eject(){
  unset DOCKER_TLS_VERIFY
  unset DOCKER_HOST
  unset DOCKER_CERT_PATH
  unset DOCKER_API_VERSION
  rm -f $HOME/.docker_env
}
