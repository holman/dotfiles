autoload colors && colors
# cheers, @ehrenmurdick
# http://github.com/ehrenmurdick/config/blob/master/zsh/prompt.zsh

if (( $+commands[git] ))
then
  git="$commands[git]"
else
  git="/usr/bin/git"
fi

git_branch() {
  echo $($git symbolic-ref HEAD 2>/dev/null | awk -F/ {'print $NF'})
}

okta_expired() {
  if [[ ! -z $OKTA_AWS_CLI_HOME ]]; then
    CURR_TIME=`date "+%s"`

    # parse okta session token
    EXPIRY=`grep OKTA_AWS_CLI_EXPIRY $OKTA_AWS_CLI_HOME/out/.okta-aws-cli-session | awk -F= '{print $2}'`
    EPOCH=`date -j -f "%Y-%m-%dT%H\:%M\:%S" "${EXPIRY%%.*}" "+%s"`
    if [[ $CURR_TIME -gt EPOCH ]]; then
      echo " [%{$fg_bold[red]%}okta: expired%{$reset_color%}]"
    else
      # figure out how many minutes are left
      T_LEFT=`date -j -f "%Y-%m-%dT%H\:%M\:%S" "${EXPIRY%%.*}" +"%M"`
      C_MIN=`date +"%M"`
      echo " %{$reset_color%}[%{$fg_bold[red]%}okta: $((60 + $T_LEFT - $C_MIN))m%{$reset_color%}]"
    fi
  else
    echo ""
  fi
}

git_dirty() {
  if $(! $git status -s &> /dev/null)
  then
    echo ""
  else
    if [[ $($git status --porcelain) == "" ]]
    then
      echo " on git : %{$fg_bold[green]%}$(git_prompt_info)%{$reset_color%}"
    else
      echo " on git : %{$fg_bold[red]%}$(git_prompt_info)%{$reset_color%}"
    fi
  fi
}

git_prompt_info () {
 ref=$($git symbolic-ref HEAD 2>/dev/null) || return
# echo "(%{\e[0;33m%}${ref#refs/heads/}%{\e[0m%})"
 echo "${ref#refs/heads/}"
}

unpushed () {
  $git cherry -v @{upstream} 2>/dev/null
}

need_push () {
  if [[ $(unpushed) == "" ]]
  then
    echo " "
  else
    echo " with %{$fg_bold[magenta]%}unpushed%{$reset_color%} "
  fi
}

ruby_version() {
  if (( $+commands[rbenv] ))
  then
    echo "$(rbenv version | awk '{print $1}')"
  fi

  if (( $+commands[rvm-prompt] ))
  then
    echo "$(rvm-prompt | awk '{print $1}')"
  fi
}

rb_prompt() {
  if ! [[ -z "$(ruby_version)" ]]
  then
    echo "%{$fg_bold[yellow]%}$(ruby_version)%{$reset_color%} "
  else
    echo ""
  fi
}

directory_name() {
  echo " in %{$fg_bold[cyan]%}%~%\/%{$reset_color%}"
}

date_and_time() {
  if [[ -z $TMUX ]]; then
    echo " %{$fg[cyan]%}%D{[%I:%M:%S]}"
  fi
}

hostname() {
  # if in TMUX window name will give hostname
  if [[ -z $TMUX ]]; then
    echo " at %{$fg[yellow]%}%m%{$reset_color%}"
  fi
}

export PROMPT=$'\n%{$fg[magenta]%}%n%{$reset_color%}$(hostname)$(directory_name)$(okta_expired)$(git_dirty)$(need_push)$(date_and_time)\n› '

set_prompt () {
  export RPROMPT="%{$fg_bold[cyan]%}%{$reset_color%}"
}

precmd() {
  title "zsh" "%m" "%55<...<%~"
  set_prompt
}
