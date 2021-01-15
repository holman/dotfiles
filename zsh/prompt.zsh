autoload colors && colors
# cheers, @ehrenmurdick
# http://github.com/ehrenmurdick/config/blob/master/zsh/prompt.zsh

if (( $+commands[git] ))
then
  git="$commands[git]"
else
  git="/usr/bin/git"
fi

ssh_connection() {
  SESSION_TYPE=""
  if [ -n "$SSH_CLIENT" ] || [ -n "$SSH_TTY" ]; then
    SESSION_TYPE=remote/ssh
  # many other tests omitted
  else
    case $(ps -o comm= -p $PPID) in
      sshd|*/sshd) SESSION_TYPE=remote/ssh;;
    esac
  fi

  echo $SESSION_TYPE
}

git_branch() {
  echo $($git symbolic-ref HEAD 2>/dev/null | awk -F/ {'print $NF'})
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
  echo "%{$fg_bold[yellow]%}%~%\/%{$reset_color%}"
}

date_and_time() {
  if [[ -z $TMUX ]]; then
    echo " %{$fg[cyan]%}%D{[%I:%M:%S]}"
  fi
}

hostname() {
  # if in TMUX window name will give hostname
  if [[ -z $TMUX ]]; then
    if [[ ! -z $SSH_CLIENT ]]; then
      echo " at %{$fg[yellow]%}%m%{$reset_color%}"
    fi
  fi
}

export PROMPT=$'\n$(hostname)$(directory_name)$(git_dirty)$(need_push)$(date_and_time)\n› '

set_prompt () {
  export RPROMPT="%{$fg_bold[cyan]%}%{$reset_color%}"
}

precmd() {
  title "zsh" "%m" "%55<...<%~"
  set_prompt
}
