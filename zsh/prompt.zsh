autoload colors && colors
# cheers, @ehrenmurdick
# http://github.com/ehrenmurdick/config/blob/master/zsh/prompt.zsh

if (( $+commands[git] ))
then
  git="$commands[git]"
else
  git="/usr/bin/git"
fi

# check if the special iterm2 mark function exists. If not then stub it for '>'
if type iterm2_prompt_mark > /dev/null; then
  # iterm prompt mark exists, no worries
else
  iterm2_prompt_mark() { echo "> " }
fi

# Prints the current working branch
git_branch() {
  echo $($git symbolic-ref HEAD 2>/dev/null | awk -F/ {'print $NF'})
}

#
git_info() {
  # Moved to file detection to improve performance. Not fool proof, but its fast
  GIT_DIR=`findup .git`
  if [[ -z $GIT_DIR ]]
  then
    echo ""
  else
    # Removed dirty checking, again because of performance issues
      echo " on %{$fg_bold[green]%}$(git_prompt_info)%{$reset_color%}$(need_push)"
  fi
}

git_prompt_info () {
 ref=$($git symbolic-ref HEAD 2>/dev/null) || return
 echo "${ref#refs/heads/}"
}

# This assumes that you always have an origin named `origin`, and that you only
# care about one specific origin. If this is not the case, you might want to use
# `$git cherry -v @{upstream}` instead.
need_push () {
  if [ $($git rev-parse --is-inside-work-tree 2>/dev/null) ]
  then
    number=$($git cherry -v origin/$(git symbolic-ref --short HEAD) 2>/dev/null | wc -l | bc)

    if [[ $number == 0 ]]
    then
      echo " "
    else
      echo " with %{$fg_bold[magenta]%}$number unpushed%{$reset_color%}"
    fi
  fi
}

directory_name() {
  echo "%{$fg_bold[cyan]%}%1/%\/%{$reset_color%}"
}

virtualenv_info (){ 
  if [[ -z $VIRTUAL_ENV ]]
  then
    echo ""
  else
    if [[ ${PWD} == ${VIRTUAL_ENV%/`basename $VIRTUAL_ENV`}* ]];
    then
      echo " using %{$fg_bold[magenta]%}local%{$reset_color%} python"
    else
      echo " using %{$fg_bold[magenta]%}${VIRTUAL_ENV}/%{$reset_color%} python"
    fi
  fi
}

directory_name() {
  echo "%{$fg_bold[cyan]%}%1/%\/%{$reset_color%}"
}

export PROMPT=$'\n%{$(iterm2_prompt_mark)%}in $(directory_name)$(git_info)$(virtualenv_info)\n› '

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
  echo "$(date "+%Y-%m-%d.%H:%M:%S") $(pwd) $(history 1 | tail -n 1)" >> ~/.shell_logs/shell-history-$(date "+%Y-%m-%d").log; \
fi'

prmptcmd() {
  eval "$PROMPT_COMMAND"
}

precmd_functions=(prmptcmd)
