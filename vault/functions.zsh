# useful vault functions (if vault present)
if (( ! $+commands[vault] )); then
  function vault_expired() {
    echo ""
  }
  return 0;
else
  function vault_expired() {
    # work in UTC time
    export TZ=UTC

    # check current if vault token is valid or expired/invalid
    T_TIME=`vault read auth/token/lookup-self 2> /dev/null | grep expire_time | awk '{print $2}'`
    if [[ -z $T_TIME ]]; then
      echo " [%{$fg_bold[red]%}vault: expired%{$reset_color%}]"
    else
      # compare to current time
      E_EPOCH=`date -j -f "%Y-%m-%dT%H:%M:%S" "${T_TIME%%.*}" "+%s"`
      C_EPOCH=`date "+%s"`
      if [[ $C_EPOCH -gt $E_EPOCH ]]; then
        echo " [%{$fg_bold[red]%}vault: expired%{$reset_color%}]"
      else
        # calculate how many minutes we have left
        echo " %{$reset_color%}%{$fg_bold[yellow]%}[%{$reset_color%}vault: %{$fg_bold[green]%}$(( ($E_EPOCH - $C_EPOCH + 30) / 60 ))m%{$reset_color%}%{$fg_bold[yellow]%}]%{$reset_color%}"
      fi
    fi
  }
fi

function vault_login() {
  # if OKTA_USERNAME isn't set prompt for it
  [[ -z $OKTA_USERNAME ]] && echo "You must set OKTA_USERNAME" && return 0

  vault auth -method=okta username=$OKTA_USERNAME
}
