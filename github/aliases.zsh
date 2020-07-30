function ssh-setup() {
  if [[ ! -z $SSH_AGENT_PID ]] && ps -p $SSH_AGENT_PID > /dev/null
  then
    echo 'Agent running'
  else
    eval `ssh-agent -s`
    ssh-add
  fi
  set-title 'SSH Enabled'
}

function shellme() {
  ssh-setup
  set-title 'Shell Host'
  ssh shell
  set-title 'SSH Enabled'
}

function vaultme() {
  ssh-setup
  set-title 'Vault Host'
  ssh vault
  set-title 'SSH Enabled'
}

function jumpme() {
  ssh-setup
  set-title 'Jump Host'
  ssh bastion
  set-title 'SSH Enabled'
}
