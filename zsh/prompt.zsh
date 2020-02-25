autoload colors && colors
# cheers, @ehrenmurdick
# http://github.com/ehrenmurdick/config/blob/master/zsh/prompt.zsh

if (( $+commands[git] ))
then
  git="$commands[git]"
else
  git="/usr/bin/git"
fi

__git_branch() {
  echo $($git symbolic-ref HEAD 2>/dev/null | awk -F/ {'print $NF'})
}

__git_dirty() {
  if $(! $git status -s &> /dev/null)
  then
    echo ""
  else
    if [[ $($git status --porcelain) == "" ]]
    then
      echo "%{$fg_bold[green]%}$(git_prompt_info)%{$reset_color%}"
    else
      echo "%{$fg_bold[red]%}$(git_prompt_info)%{$reset_color%}"
    fi
  fi
}

repo_name() {
  repo=$(basename `git rev-parse --show-toplevel`) || return
  echo "%{$fg_bold[cyan]%}$repo%{$reset_color%}"
}

git_prompt_info () {
 ref=$($git symbolic-ref HEAD 2>/dev/null) || return
# echo "(%{\e[0;33m%}${ref#refs/heads/}%{\e[0m%})"
 echo "${ref#refs/heads/}"
}

# This assumes that you always have an origin named `origin`, and that you only
# care about one specific origin. If this is not the case, you might want to use
# `$git cherry -v @{upstream}` instead.
__need_push () {
  if [ $(git rev-parse --is-inside-work-tree 2>/dev/null) ]
  then
    number=$(git cherry -v origin/$(git symbolic-ref --short HEAD) 2>/dev/null | wc -l | bc)

    if [[ $number == 0 ]]
    then
      echo " "
    else
      echo " with %{$fg_bold[magenta]%}$number unpushed%{$reset_color%}"
    fi
  fi
}

__directory_name() {
  local dirPath
  dirPath=`pwd`
  if $($git status -s &> /dev/null)
  then
     dirPath="$(basename `$git rev-parse --show-toplevel`)/$($git rev-parse --show-prefix)"
  fi
  echo $(__colorize cyan "$dirPath")
  
}

__battery_status() {
  if [[ $(sysctl -n hw.model) == *"Book"* ]]
  then
    $ZSH/bin/battery-status
  fi
}
__beerTime()  {
  if [[ $(date +%k) -gt 14 ]]
  then
    echo 🍺
  fi
}
__colorize() {
  echo "%{$fg_bold[$1]%} $2 %{$reset_color%}"
}
__kubeContext() {
  ico='\u2388'
  if ! type "kubectl" > /dev/null; then
    return
  fi
  kube=$(kubectl config current-context 2> /dev/null ) || return
  kubefile=$(readlink ~/.kube/config)
  kubeNS="$(kubectl config view --minify --output 'jsonpath={..namespace}' 2>/dev/null)"
  # echo "$ico $(__colorize blue $kube ) $(__colorize purple $kubeNS ) from: $(__colorize yellow $kubefile ) \n"
  iterm2_set_user_var kube_ctx "$kube"
  iterm2_set_user_var kube_ns "$kubeNS"
}
# export PROMPT=$'\n$(__battery_status) $(__directory_name) $(__git_dirty)$(__need_push) $(__beerTime) \n $(__kubeContext) \n›'
export PROMPT=$'\n$(__battery_status) $(__directory_name) $(__git_dirty)$(__need_push) $(__beerTime)\n›'
set_prompt () {
  export RPROMPT="%{$fg_bold[cyan]%}%{$reset_color%}"
}

precmd() {
  __kubeContext
  title "zsh" "%m" "%55<...<%~"
  set_prompt
  stt_both `pwd`
}

__setTerminalText () {
    # echo works in bash & zsh
    local mode=$1 ; shift
    echo -ne "\033]$mode;$@\007"
}
stt_both  () { __setTerminalText 0 $@; }
stt_tab   () { __setTerminalText 1 $@; }
stt_title () { __setTerminalText 2 $@; }
