# cheers, @ehrenmurdick
# http://github.com/ehrenmurdick/config/blob/master/zsh/prompt.zsh

git_branch() {
  echo $(git symbolic-ref HEAD 2>/dev/null | awk -F/ {'print $NF'})
}
 
git_dirty() {
  st=$(git status 2>/dev/null | tail -n 1)
  if [[ $st == "" ]]
  then
    echo ""
  else
    if [[ $st == "nothing to commit (working directory clean)" ]]
    then
      echo "%{\033[1;38m%}$(git_prompt_info)%{\033[0m%}"
    else
      echo "%{\033[1;34m%}$(git_prompt_info)%{\033[0m%}"
    fi
  fi
}
 
git_prompt_info () {
 ref=$(git symbolic-ref HEAD 2>/dev/null) || return
# echo "(%{\e[0;33m%}${ref#refs/heads/}%{\e[0m%})"
 echo "${ref#refs/heads/}"
}
 
project_name () {
  name=$(pwd | awk -F'Development/' '{print $2}' | awk -F/ '{print $1}')
  echo $name
}
 
project_name_color () {
#  name=$(project_name)
  echo "%{\e[0;35m%}${name}%{\e[0m%}"
}
 
unpushed () {
  git cherry -v origin/$(git_branch) 2>/dev/null
}
 
need_push () {
  if [[ $(unpushed) == "" ]]
  then
    echo " "
  else
    echo "%{\e[0;34m%} + %{\e[0m%}"
  fi
}

rvm_prompt(){
	echo "\e[1;33m$(~/.rvm/bin/rvm-prompt i)\e[0m ·"
}

export PROMPT=$'$(rvm_prompt) %{\e[0;36m%}%1/%{\e[0m%} › '
set_prompt () {
  export RPROMPT="$(need_push)$(project_name_color)$(git_dirty)"
}
 
precmd() {
  set_prompt
}