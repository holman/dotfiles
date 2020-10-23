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
      echo "$(__colorize green $(git_prompt_info) )"
    else
      echo "$(__colorize red $(git_prompt_info))"
    fi
  fi
}

repo_name() {
  repo=$(basename `git rev-parse --show-toplevel`) || return
  echo "$(__colorize cyan $repo) "
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
      echo " with $(__colorize magenta $number unpushed)"
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
  color=$1
  shift
  echo "%{$fg_bold[$color]%} $@ %{$reset_color%}"
}
__kubeContext() {
  if ! type "kubectl" > /dev/null; then
    return
  fi
  kube=$(kubectl config current-context 2> /dev/null ) || return
  kubefile=$(readlink ~/.kube/config)
  kubeNS="$(kubectl config view --minify --output 'jsonpath={..namespace}' 2>/dev/null)"
  echo "$(__colorize blue '\u2388' ${kube} ${kubeNS} ) "
  # iterm2_set_user_var kube_ctx "$kube"
  # iterm2_set_user_var kube_ns "$kubeNS"
}
export PROMPT=$'\n$(__kubeContext)\n$(__battery_status) $(__directory_name) $(__git_dirty)$(__need_push) $(__beerTime) \n›'
# export PROMPT=$'\n$(__battery_status) $(__directory_name) $(__git_dirty)$(__need_push) $(__beerTime)\n'
# PROMPT=$'$(PROMPT) $(kube) $(kubeNS)\n›'
# export $PROMPT
set_prompt () {
  export RPROMPT=""
}

precmd() {
  # __kubeContext
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
