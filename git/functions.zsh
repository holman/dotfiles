# useful openSSL functions (if openssl present)
if (( ! $+commands[git] ))
then
 return 0;
fi

# wrapper to specified SSH key
function git_key_wrapper() {
  if [ $# -eq 0 ]; then
    echo "Git wrapper script that can specify ssh-key file

Usage:
     git.sh -i ssh-key-file git-command
     "
     exit 1
  fi

  # remove temporary file on exit
  trap 'rm -f /tmp/.git_ssh.$$' 0

  if [ "$1" = "-i" ]; then
    SSH_KEY=$2; shift; shift
    echo "ssh -i $SSH_KEY \$@" > /tmp/.git_ssh.$$
    chmod +x /tmp/.git_ssh.$$
    export GIT_SSH=/tmp/.git_ssh.$$
  fi

  [ "$1" = "git" ] && shift

  # run the git command
  git "$@"
}
