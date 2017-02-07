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
  if $(! $git status -s &> /dev/null)
  then
    echo ""
  else
    if [[ $($git status --porcelain) == "" ]]
    then
      echo "on %{$fg_bold[green]%}$(git_prompt_info)%{$reset_color%}"
    else
      echo "on %{$fg_bold[red]%}$(git_prompt_info)%{$reset_color%}"
    fi
  fi
}

prompt_git_info() {
  if [ -n "$__CURRENT_GIT_BRANCH" ]; then
      local s="("
      s+="$__CURRENT_GIT_BRANCH"
      case "$__CURRENT_GIT_BRANCH_STATUS" in
          ahead)
          s+="↑"
          ;;
          diverged)
          s+="↕"
          ;;
          behind)
          s+="↓"
          ;;
      esac
      if [ -n "$__CURRENT_GIT_BRANCH_IS_DIRTY" ]; then
          # s+="⚡"
          s+="⚡️ "
      fi
      s+=")"

      if [[ $($git status --porcelain) == "" ]]
      then
        # echo "on %{$fg_bold[green]%}$(git_prompt_info)%{$reset_color%}"
        printf " on %s%s" "%{$fg_bold[green]%}" $s
      else
        # echo "on %{$fg_bold[red]%}$(git_prompt_info)%{$reset_color%}"
        printf " on %s%s" "%{$fg_bold[red]%}" $s
      fi
      echo "%{$reset_color%}"

  fi
}

git_prompt_info () {
 ref=$($git symbolic-ref HEAD 2>/dev/null) || return
# echo "(%{\e[0;33m%}${ref#refs/heads/}%{\e[0m%})"
 echo "[${ref#refs/heads/}]"
 # echo "[$(git_branch)]"
}

unpushed () {
  $git cherry -v @{upstream} 2>/dev/null
}

# need_push () {
#   if [[ $(unpushed) == "" ]]
#   then
#     echo " "
#   else
#     echo " with %{$fg_bold[magenta]%}unpushed%{$reset_color%} "
#   fi
# }


# This assumes that you always have an origin named `origin`, and that you only
# care about one specific origin. If this is not the case, you might want to use
# `$git cherry -v @{upstream}` instead.
need_push () {
  if [ $($git rev-parse --is-inside-work-tree 2>/dev/null) ]
  then
    number=$($git cherry -v origin/$(git symbolic-ref --short HEAD) | wc -l | bc)

    if [[ $number == 0 ]]
    then
      echo " "
    else
      echo " with %{$fg_bold[magenta]%}$number unpushed%{$reset_color%}"
    fi
  fi
}
# ruby_version() : This method becomes obosolete for rbenv :
# Since there is a : `rbenv version-name` command
ruby_version() {
  if (( $+commands[rbenv] ))
  then
    # rbv=($(rbenv version)) # Wrap it in () to turn it into an array
    # print ${rbv[1]}
    # echo "$(rbenv version | awk '{print $1}')"
    echo $(rbenv version-name)
  elif (( $+commands[rvm-prompt] ))
  then
    echo "$(rvm-prompt | awk '{print $1}')"
  fi
}

rb_prompt() {
  if ! [[ -z "$(ruby_version)" ]]
  then
    echo "%{$fg_bold[yellow]%}ruby-$(ruby_version)%{$reset_color%} "
  else
    echo ""
  fi
}

directory_name() {
  # echo "%{$fg_bold[cyan]%}%1/%\/%{$reset_color%}"
  echo "%{${fg[cyan]}%}%B%~%b"
}

battery_status() {
  $ZSH/bin/battery-status
  # battery -p | sed -e 's/\%/\%\%/g'
}

# export PROMPT=$'\n$(rb_prompt)in $(directory_name) $(git_dirty)$(need_push)\n› '

# PROMPT=$'\n$(rb_prompt)in %{${fg[cyan]}%}%B%~%b$(prompt_git_info)%{${fg[default]}%}$(need_push)\n› '
# PROMPT=$'\n$(battery_status)$(rb_prompt)in %{${fg[cyan]}%}%B%~%b$(prompt_git_info)%{${fg[default]}%}$(need_push)\n› '
PROMPT=$'\n$(battery_status)$(rb_prompt)in $(directory_name)$(prompt_git_info)$(need_push)\n› '
# PROMPT=$'%{${fg[cyan]}%}%B%~%b $(git_dirty)%{${fg[default]}%} '
# SPROMPT="zsh: correct %F{red}'%R'%f to %F{red}'%r'%f [%B%Uy%u%bes, %B%Un%u%bo, %B%Ue%u%bdit, %B%Ua%u%bbort]? "
SPROMPT="zsh: correct %{${fg_bold[red]}%}'%R'%f to %F{red}'%r'%f [%B%Uy%u%bes, %B%Un%u%bo, %B%Ue%u%bdit, %B%Ua%u%bbort]? "
set_prompt () {
  export RPROMPT="%{$fg_bold[cyan]%}%{$reset_color%}"
}

precmd() {
  title "zsh" "%m" "%55<...<%~"
  set_prompt
}
