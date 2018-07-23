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
      echo "branch: %{$fg_bold[green]%}$(git_prompt_info)%{$reset_color%}"
    else
      echo "branch: %{$fg_bold[red]%}$(git_prompt_info)%{$reset_color%}"
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
  if $($git status -s &> /dev/null)
  then
    path="$(basename `git rev-parse --show-toplevel`)/$(git rev-parse --show-prefix)"
    echo "repo: %{$fg_bold[cyan]%}$path%{$reset_color%}"
  else
    path=`pwd`
    echo "%{$fg_bold[cyan]%}$path%{$reset_color%}"
  fi
}

battery_status() {
  if [[ $(sysctl -n hw.model) == *"Book"* ]]
  then
    $ZSH/bin/battery-status
  fi
}
beerTime()  {
  if [[ $(date +%k) -gt 14 ]]
  then
    echo 🍺
  fi
}
kubeContext() {
  kube=$(kubectl config current-context) || return
  kubefile=$(basename $(readlink ~/.kube/config))
  echo "kube: %{$fg_bold[blue]%}$kube%{$reset_color%} from: $kubefile\n"
}
export PROMPT=$'\n$(battery_status) $(directory_name) $(git_dirty)$(need_push) $(beerTime) \n $(kubeContext) \n›'
set_prompt () {
  export RPROMPT="%{$fg_bold[cyan]%}%{$reset_color%}"
}

precmd() {
  title "zsh" "%m" "%55<...<%~"
  set_prompt
  stt_both `pwd`
}

setTerminalText () {
    # echo works in bash & zsh
    local mode=$1 ; shift
    echo -ne "\033]$mode;$@\007"
}
stt_both  () { setTerminalText 0 $@; }
stt_tab   () { setTerminalText 1 $@; }
stt_title () { setTerminalText 2 $@; }
