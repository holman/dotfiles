# useful openSSL functions (if openssl present)
#if (( ! $+commands[openssl] ))
#then
# return 0;
#fi

#okta_expired() {
#  if [[ ! -z $OKTA_AWS_CLI_HOME ]]; then
    # work in UTC TIME
#    export TZ=UTC

    # check current okta session expiration
#    T_TIME=`grep OKTA_AWS_CLI_EXPIRY $OKTA_AWS_CLI_HOME/out/.okta-aws-cli-session 2> /dev/null | awk -F= '{print $2}'`
#    if [[ -z $T_TIME ]]; then
#      echo " %{$reset_color%}%{$fg_bold[yellow]%}[%{$reset_color%}okta: %{$fg_bold[red]%}expired%{$reset_color%}%{$reset_color%}%{$fg_bold[yellow]%}]%{$reset_color%}"
#    else
      # compare to current time
#      E_EPOCH=`date -j -f "%Y-%m-%dT%H\:%M\:%S" "${T_TIME%%.*}" "+%s"`
#      C_EPOCH=`date "+%s"`
#      if [[ $C_EPOCH -gt $E_EPOCH ]]; then
#        echo " %{$reset_color%}%{$fg_bold[yellow]%}[%{$reset_color%}okta: %{$fg_bold[red]%}expired%{$reset_color%}%{$reset_color%}%{$fg_bold[yellow]%}]%{$reset_color%}"
#      else
        # calculate how many minutes we have left
#        echo " %{$reset_color%}%{$fg_bold[yellow]%}[%{$reset_color%}okta: %{$fg_bold[green]%}$(( ($E_EPOCH - $C_EPOCH + 60) / 60 ))m%{$reset_color%}%{$fg_bold[yellow]%}]%{$reset_color%#}"
#      fi
#    fi
#  fi
#}

#function aws_login() {
#  [[ ! -d $OKTA_AWS_CLI_HOME ]] && echo "$OKTA_AWS_CLI_HOME doesn't exist, did you install the tools?" && return 255

  # delete current credentials file
#  rm -f ~/.aws/credentials

  # classpath is relative
#  pushd $OKTA_AWS_CLI_HOME/out
#  ./awscli sts get-caller-identity
#  popd

  # fix ~/.aws/credentials default profile so terragrunt/terraform will work
#  sed '1 s/^.*$/[default]/' ~/.aws/credentials > /tmp/aws.creds.default

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
#  cp ~/.aws/credentials /tmp/aws.creds
#  cat  /tmp/aws.creds /tmp/aws.creds.default > ~/.aws/credentials
#  rm -f /tmp/aws.creds /tmp/aws.creds.default
#}

ssh() {
  if [ "$(ps -p $(ps -p $$ -o ppid=) -o comm=)" = "tmux" ]; then
    tmux rename-window "$(echo $* | cut -d . -f 1)"
    command ssh "$@"
    tmux set-window-option automatic-rename "on" 1> /dev/null
  else
    command ssh "$@"
  fi
}
#! /bin/bash
if [[ -z "$AWS_KEYPAIR_DIR" ]]; then
    echo "Warning: AWS_KEYPAIR_DIR is not defined.  See EnvironmentSetup.txt for more information" >&2
fi

this_dir="$(cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd)"

ssh-dat-build() {
    ssh -i $AWS_KEYPAIR_DIR/DATNonProdKeyPair.pem mobile@build.dat-mobile.com
}

ssh-dat-qa() {
    _ssh_dat dat-qa us-west-2 "$1"
}

ssh-dat-apps() {
    _ssh_dat dat-apps us-west-2 "$1"
}

ssh-dat-apps-prod() {
    _ssh_dat dat-apps-prod us-west-2 "$1"
}

ssh-dat-test() {
  _ssh_dat test us-west-2 "$1"
}

ssh-dat-old() {
    _ssh_dat dat us-west-2 "$1"
}

# first argument is a string to filter by, second (optional) argument is the aws region
_ssh_dat() {
    local server

    # check if OKTA installed and whether token is valid
    if [[ ! -z $OKTA_AWS_CLI_HOME ]]; then
      echo "HERE"
    fi

    server=$(choose-dat-server "$1" "$2" linux $3) || return $?

    local instance_name
    local keypair_name
    local private_ip
    local instance_id
    read instance_name keypair_name private_ip instance_id <<< $(echo "$server")

    echo -e "Connecting to: $instance_name at IP $private_ip with keypair $keypair_name"

    if [[ "$keypair_name" = "DATProdKeyPair" ]]; then
        read REPLY\?"It appears that you're trying to connect to production, type YES to continue: "
        if [[ "$REPLY" != "YES" ]]; then
            echo "Cancelled"
            return 0
        fi
    fi

    ssh -o StrictHostKeyChecking=no -i $AWS_KEYPAIR_DIR/$keypair_name.pem ec2-user@$private_ip
}

rdp-dat-old() {
    _rdp_dat dat us-west-2 "$1"
}

rdp-dat-apps() {
    _rdp_dat dat-apps us-west-2 "$1"
}

rdp-dat-test() {
  _rdp_dat test us-west-2 "$1"
}

rdp-dat-apps-prod() {
    _rdp_dat dat-apps-prod us-west-2 "$1"
}

# first argument is a string to filter by, second (optional) argument is the aws region
_rdp_dat() {
    local server
    server=$(choose-dat-server "$1" "$2" "windows" $3) || return $?

    local instance_name
    local keypair_name
    local private_ip
    local instance_id
    read instance_name keypair_name private_ip instance_id <<< $(echo "$server")

    echo -e "Connecting to: $instance_name at IP $private_ip"

    local password
    if [[ "$keypair_name" =~ .*prod-key-pair ]]; then
        read -p "
It appears that you're trying to connect to production, type YES to continue: " connect_to_prod
        if [[ "$connect_to_prod" != "YES" ]]; then
            echo "Cancelled"
            return 0
        fi

        if [[ -z "$AWS_WIN_PASSWORD_DAT_APPS_PROD" ]]; then
            echo "You must have the environment variable AWS_WIN_PASSWORD_DAT_APPS_PROD defined" >&2
            return 1
        fi
        password="$AWS_WIN_PASSWORD_DAT_APPS_PROD"
    else
        if [[ -z "$AWS_WIN_PASSWORD_DAT_APPS" ]]; then
            echo "You must have the environment variable AWS_WIN_PASSWORD_DAT_APPS defined" >&2
            return 1
        fi
        password="$AWS_WIN_PASSWORD_DAT_APPS"
    fi

    # this copies the password to the clipboard to easily be pasted
    printf "$password" | pbcopy

    # remote desktop can be opened via a url scheme as defined here:
    #https://technet.microsoft.com/en-us/library/dn690096(v=ws.11).aspx
    local rdp_url="rdp://full%20address=s:$private_ip&screen%20mode%20id=i:0&desktopwidth=i:1280&desktopheight=i:720&drivestoredirect=s:*&use%20multimon=i:0&session%20bpp=i:24&audiomode=i:2&username=s:Administrator&disable%20wallpaper=i:0&disable%20full%20window%20drag=i:0&disable%20menu%20anims=i:0&disable%20themes=i:0&alternate%20shell=s:&shell%20working%20directory=s:&authentication%20level=i:0&connect%20to%20console=i:0&gatewayusagemethod=i:0&disable%20cursor%20setting=i:0&allow%20font%20smoothing=i:1&allow%20desktop%20composition=i:1&redirectprinters=i:0&prompt%20for%20credentials%20on%20client=i:1"

    open "$rdp_url"
}

# this function is called with 4 filter arguments: aws profile, aws region, operating system, and
# a string to 'grep' the results by
choose-dat-server() {
    local server_list
    server_list=$(list-dat-servers "$1" "$2" "$3" "$4") || return $?
    server_list=$(echo "$server_list")
    local server
    server=$(select_from_list "$server_list" "Connect to server #") || return $?
    local keypair_name=$(echo $server | awk '{print $2}')
    local keypair_file=$(find-keypair $keypair_name) || return $?
    echo "$server"
}

# pass the name of the keypair to find
find-keypair() {
    if [ -z "$AWS_KEYPAIR_DIR" ]; then
        echo "AWS_KEYPAIR_DIR must be defined" >&2
        return 1
    fi

    local keypair_file="$AWS_KEYPAIR_DIR/$1.pem"
    if [[ ! -f "$keypair_file" ]]; then
        echo "Could not find $keypair_file" >&2
        return 1
    fi

    echo "$keypair_file"
}

# this function is called with the same filter arguments as choose-dat-server
list-dat-servers() {
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
    local input_list=($(echo "$1"))
    unset IFS

    local index=1
    local temp=""
    local str
    for i in "${input_list[@]}"; do
        str=$(printf "%5s" "[$index]")
        temp="$temp$str $i
"
        index=$(($index + 1))
    done

    read index\?"$temp"

    if [[ ! "$index" =~ ^[0-9]+$ ]]; then
        echo "Invalid selection, please enter a number" >&2
        return 1
    fi

    index=$(($index - 1))
    local input_list_size=${#input_list[@]}

    if [[ $index -ge $input_list_size ]] || [[ $index -lt 0 ]]; then
        echo "Invalid selection" >&2
        return 1
    fi

    local selected_list_item=${input_list[$index]}
    echo "$selected_list_item"
}

# exported functions cannot use hyphens in their names
#export -f select_from_list
