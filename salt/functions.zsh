# useful salt-api functions (if curl present)
if (( ! $+commands[curl] ))
then
 return 0;
fi

# validate our current login token, or generate a new one
function t_login() {

  # create necessary directory structure
  [[ ! -d ~/.salt ]] && mkdir ~/.salt

  # if current cookies don't exist, login
  [[ ! -f ~/.salt/cookies.txt ]] && p_login $1 && return

  # if we get here a current cookies file exist, but is it valid 
  HTTP_STATUS=$(curl -w "%{http_code}" -o /dev/null -sk https://$1:8000 -b ~/.salt/cookies.txt -H "Accept: application/x-yaml" -d client=local)
  # we won't get a 200 response code because above isn't a valid request, but we shouldn't get a 401 meaning
  # unauthorized
  if [[ $HTTP_STATUS -eq 401 ]]; then
    p_login $1
  fi

}

# login
function p_login() {

  echo "Your login token appears to be invalid, please re-authenticate to Salt server $1"
  # perform a login
  echo -n "Username: "
  read user
  echo -n "Password: "
  read -s password

  # peform a login
  curl -sSk -w "%{http_code}" https://$1:8000/login -c ~/.salt/cookies.txt -H 'Accept: application/x-yaml' -d username=$user -d password=$password -d eauth=pam
}

# run command
function salt() {
  # need to supply three options
  # 
  #   - salt master
  #   - module
  #   - target
  t_login $1
  curl -sSk https://$1:8000 -b ~/.salt/cookies.txt -H 'Accept: application/x-yaml' -d client=local -d tgt="$3" -d fun="$2"
}
