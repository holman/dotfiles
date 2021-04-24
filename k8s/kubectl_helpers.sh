# echo importing kubectl aliases
alias kc='kubectl'
alias kci='kubectl cluster-info'
alias kcid='kubectl cluster-info dump'
alias kce='kubectl exec'
alias kcg='kubectl get'
alias kcs='kubectl describe'
alias kcd='kubectl delete'
alias kcgd='kubectl get deployments'
alias kcsd='kubectl describe deployments'
alias kcdd='kubectl delete deployments'
alias kcgp='kubectl get pod'
alias kcsp='kubectl describe pod'
alias kcdp='kubectl delete pod'
alias kcgn='kubectl get node'
alias kcsn='kubectl describe node'
alias kcdn='kubectl delete node'
alias kcgns='kubectl get namespace'
alias kcsns='kubectl describe namespace'
alias kcdns='kubectl delete namespace'
alias kcgs='kubectl get services'
alias kcss='kubectl describe services'
alias kcds='kubectl delete services'
alias kcgx='kubectl get secret'
alias kcsx='kubectl describe secret'
alias kcdx='kubectl delete secret'

function kclogin() {
  tsh --auth=github --proxy=auth-$1.test.infoblox.com:3080 login $1
}

alias k2a='kclogin env-2a'
alias k4='kclogin env-4'
alias k5='kclogin env-5'

# for the contacts app, FIXME: they do not work when connected to VPN
# KC_SERVER=$(kubectl config view --minify | grep server | cut -f 2- -d ":" | tr -d " ")
# KC_SECRET_NAME=$(kubectl get secrets | grep ^default | cut -f1 -d ' ')
# KC_TOKEN=$(kubectl describe secret $KC_SECRET_NAME | grep -E '^token' | cut -f2 -d':' | tr -d " ")
# KC_TOKEN_CONTACTS_APP='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3RAaW5mb2Jsb3guY29tIiwiYXBpX3Rva2VuIjoiZWJiY2ZlMDI5MmRmOGE1YzhmZDEzMWU0NjM3ZGNiODQiLCJhY2NvdW50X2lkIjoiMSIsImdyb3VwcyI6WyJhZG1pbiIsImVuZ2luZWVyIl0sImV4cCI6MjM5ODM2NzU0MCwianRpIjoiVE9ETyIsImlhdCI6MTUzNDM2NzU0MCwiaXNzIjoiYXRoZW5hLWF1dGhuLXN2YyIsIm5iZiI6MTUzNDM2NzU0MH0.Fr6RVggMqbH6WXPwaJl9Q03lem2pDB_OHHyQ2yySack'
# alias kcc='curl --insecure --header "Authorization: Bearer ${KC_TOKEN_CONTACTS_APP}"'
# alias kcci='curl --insecure --header "Authorization: Bearer ${KC_TOKEN}" ${KC_SERVER}/api'

# for the saas-app-deployment https://github.com/Infoblox-CTO/saas-app-deployment/tree/master/deployment/ngp-onprem#33--setup-environment-variables
# export USER=$(git config user.email | sed -e 's/\@.*//')
export REGISTRY_TAG=infobloxcto
export VERSION_TAG=3.2.0 # Please use the latest version in https://hub.docker.com/r/infobloxcto/onprem.agent/
export CSP_HOST=www-test.csp.infoblox.com # Change this with CSP that is being used by your team
export S3_BUCKET=https://s3.amazonaws.com/ib-noa-test/gshirazi # Change this with the bucket/folder created for you
export AWS_IAM_ROLE=ngp.k8.core
export KUBERNETES_NAMESPACE=g # Namespace that you created in Section 2.1

# helm
export AWS_ACCESS_KEY_ID=$(aws configure get aws_access_key_id)
export AWS_SECRET_ACCESS_KEY=$(aws configure get aws_secret_access_key)
export AWS_REGION=$(aws configure get region)
export AWS_SESSION_TOKEN=$(aws configure get aws_session_token)

alias helm='docker run --rm -v $PWD:/app -e AWS_REGION=${AWS_REGION} -e AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID} -e AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY} -e AWS_SESSION_TOKEN=$(AWS_SESSION_TOKEN) infoblox/helm:3.2.4-5b243a2' 
alias hl='helm list'
alias hls='helm list'
alias hli='helm lint'
alias hd='helm delete'
alias hi='helm install'
