# useful openSSL functions (if openssl present)
#if (( ! $+commands[openssl] ))
#then
# return 0;
#fi

okta_expired() {
  if [[ ! -z $OKTA_AWS_CLI_HOME ]]; then
    # work in UTC TIME
    export TZ=UTC

    # check current okta session expiration
    T_TIME=`grep OKTA_AWS_CLI_EXPIRY $OKTA_AWS_CLI_HOME/out/.okta-aws-cli-session 2> /dev/null | awk -F= '{print $2}'`
    if [[ -z $T_TIME ]]; then
      echo " [%{$fg_bold[red]%}okta: expired%{$reset_color%}]"
    else
      # compare to current time
      E_EPOCH=`date -j -f "%Y-%m-%dT%H\:%M\:%S" "${T_TIME%%.*}" "+%s"`
      C_EPOCH=`date "+%s"`
      if [[ $C_EPOCH -gt $E_EPOCH ]]; then
        echo " [%{$fg_bold[red]%}okta: expired%{$reset_color%}]"
      else
        # calculate how many minutes we have left
        echo " %{$reset_color%}[%{$fg_bold[red]%}okta: $(( ($E_EPOCH - $C_EPOCH + 60) / 60 ))m%{$reset_color%}]"
      fi
    fi
  fi
}

function aws_login() {
  [[ ! -d $OKTA_AWS_CLI_HOME ]] && echo "$OKTA_AWS_CLI_HOME doesn't exist, did you install the tools?" && return 255

  # delete current credentials file
  rm -f ~/.aws/credentials

  # classpath is relative
  pushd $OKTA_AWS_CLI_HOME/out
  ./awscli sts get-caller-identity
  popd

  # fix ~/.aws/credentials default profile so terragrunt/terraform will work
  sed '1 s/^.*$/[default]/' ~/.aws/credentials > /tmp/aws.creds.default

  #line_count=`wc -l < ~/.aws/credentials`
  #if [[ $line_count -gt 5 ]]; then
  #  # remove last 4 lines (which should be the default profile
  #  sed -e :a -e '$d;N;2,4ba' -e 'P;D' ~/.aws/credentials > /tmp/aws.creds.tmp
  #else
  #  cp ~/.aws/credentials /tmp/aws.creds.tmp
  #fi

  # now clone the active profile
  #sed '1 s/^.*$/[default]/' /tmp/aws.creds.tmp > /tmp/aws.creds.default.tmp

  # combine the two files
  cp ~/.aws/credentials /tmp/aws.creds
  cat  /tmp/aws.creds /tmp/aws.creds.default > ~/.aws/credentials
  rm -f /tmp/aws.creds /tmp/aws.creds.default
}

ssh() {
  if [ "$(ps -p $(ps -p $$ -o ppid=) -o comm=)" = "tmux" ]; then
    tmux rename-window "$(echo $* | cut -d . -f 1)"
    command ssh "$@"
    tmux set-window-option automatic-rename "on" 1> /dev/null
  else
    command ssh "$@"
  fi
}

ssh-dat-qa() {
  _ssh_dat dat-qa us-west-2 "$1"
}

aws_ssh_dat() {
  local server
  server=$(choose-server "$1" "$2" linux $3) || return $?

  local instance_name
  local keypair_name
  local private_ip
  local instance_id
  read instance_name keypair_name private_ip instance_id <<< $(echo "$server")

  echo -e "Connecting to: $instance_name at IP $private_ip with keypair $keypair_name"

  if [[ "$keypair_name" = "DATProdKeyPair" ]]; then
    read -p "
It appears that you're trying to connect to production, type YES to continue: " connect_to_prod
    if [[ "$connect_to_prod" != "YES" ]]; then
      echo "Cancelled"
      return 0
    fi
  fi

  ssh -o StrictHostKeyChecking=no -i $AWS_KEYPAIR_DIR/$keypair_name.pem ec2-user@private_ip
}

choose-server() {
  local server_list
  server_list=$(list-aws-servers "$1" "$2" "$3" "$4") || return $?
  echo $server_list
  server_list=$(echo "$server_list")

  local server
  server=$(select_from_list "$server_list" "Connect to server #") || return $?

}

#
# Description: query list of AWS servers
#
# Parameters:
#    - profile : AWS profile as defined in ~/.aws/config to use
#    - region: AWS region to query
#    - OS: Operating System (Windows or Linux) to query (based on Tag.Name=OS)
list-aws-servers() {
  local profile="$1"
  local region="$2"

  local instance_filter='?State.Name==`running` && Tags[?Key==`OS` && Value==`'"$3"'`]'

  local query='
    Reservations[*]
    .Instances['"$instance_filter"']
    .[Tags[?Key==`Name`] | [0].Value, KeyName, PrivateIpAddress, InstanceId, Tags[?Key==`OS`] | [0].Value]
  '
  local output=$(aws ec2 describe-instances --query "$query" --profile "$profile" --region "$region" --output text)

  if [[ -n "$4" ]]; then
    output=$(echo "$output" | grep "$4")
  fi
  echo "$output" | column -t | sort
}

select_from_list() {
  IFS=$'\n'
  local inpput_list=($(echo "$1"))
  unset IFS

  local index=1
  local temp=""
  local str
  for i in "${input_list[@]}"; do
    str=$(printf "%5s" "[$index]")
    temp="$temp$str $i
"
    index=$(($index +1))
  done

  read -p "$temp
$2: " index

  if [[ ! "$index" =~ ^[0-9]+$ ]]; then
    echo "Invalid selection, please enter a number" >&2
    return 1
  fi

  index=$(($index - 1))
  local input_list_size=${#input_list[@]}

  if [[ $index -ge $input_list_size ]] || [[ $index -lt 0 ]]; then
    echo "Invalid selection" >&2
  fi

  local selected_list_item=${input_list[$index]}
  echo "$selected_list_item"
}
