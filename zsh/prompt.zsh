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

git_dirty() {
  # Moved to file detection to improve performance. Not fool proof, but its fast
  if [[ ! -a ./.git ]]
  then
    echo ""
  else
    # Removed dirty checking, again because of performance issues
    echo "on %{$fg_bold[green]%}$(git_prompt_info)%{$reset_color%}"
  fi
}

git_prompt_info () {
 ref=$($git symbolic-ref HEAD 2>/dev/null) || return
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

directory_name() {
  echo "%{$fg_bold[cyan]%}%1/%\/%{$reset_color%}"
}

export PROMPT=$'\nin $(directory_name) $(git_dirty)$(need_push)\n› '
set_prompt () {
  export RPROMPT="%{$fg_bold[cyan]%}%{$reset_color%}"
}

precmd() {
  title "zsh" "%m" "%55<...<%~"
  set_prompt
}

#
# Prompt Command
#
if [[ ! -a ~/.shell_logs ]]
  then mkdir ~/.shell_logs
fi

# Don't record anything by user 0
export PROMPT_COMMAND='if [ "$(id -u)" -ne 0 ]; \
then \
  echo "$(date "+%Y-%m-%d.%H:%M:%S") $(pwd) $(history 1)" >> ~/.shell_logs/shell-history-$(date "+%Y-%m-%d").log; \
fi'

prmptcmd() {
  eval "$PROMPT_COMMAND"
}

precmd_functions=(prmptcmd)
