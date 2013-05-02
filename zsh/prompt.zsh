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
  st=$($git status 2>/dev/null | tail -n 1)
  if [[ $st == "" ]]
  then
    echo ""
  else
    if [[ "$st" =~ ^nothing ]]
    then
      echo "on %{$fg_bold[green]%}$(git_prompt_info)%{$reset_color%}"
    else
      echo "on %{$fg_bold[red]%}$(git_prompt_info)%{$reset_color%}"
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

rb_prompt(){
  if (( $+commands[rbenv] ))
  then
	  echo "%{$fg_bold[yellow]%}$(rbenv version | awk '{print $1}')%{$reset_color%}"
	else
	  echo ""
  fi
}

# This keeps the number of todos always available the right hand side of my
# command line. I filter it to only count those tagged as "+next", so it's more
# of a motivation to clear out the list.
todo(){
  if (( $+commands[todo.sh] ))
  then
    num=$(echo $(todo.sh ls +next | wc -l))
    let todos=num-2
    if [ $todos != 0 ]
    then
      echo "$todos"
    else
      echo ""
    fi
  else
    echo ""
  fi
}

# This takes care of displaying the dir structure you're currently in up to
# three levels. Also it detects so when you are in a git repository or submodule
# and it will keep the root always visible in a different color. Issue #71
# http://stackoverflow.com/questions/16147173/command-prompt-directory-styling/16214977#16214977
directory_name() {
    PROMPT_PATH=""

    CURRENT=`dirname ${PWD}`
    if [[ $CURRENT = / ]]; then
        PROMPT_PATH=""
    elif [[ $PWD = $HOME ]]; then
        PROMPT_PATH=""
    else
        if [[ -d $(git rev-parse --show-toplevel 2>/dev/null) ]]; then
            # We're in a git repo.
            BASE=$(basename $(git rev-parse --show-toplevel))
            if [[ $PWD = $(git rev-parse --show-toplevel) ]]; then
                # We're in the root.
                PROMPT_PATH=""
            else
                # We're not in the root. Display the git repo root.
                GIT_ROOT="%{$fg_bold[bluecd]%}${BASE}%{$reset_color%}"

                PATH_TO_CURRENT="${PWD#$(git rev-parse --show-toplevel)}"
                PATH_TO_CURRENT="${PATH_TO_CURRENT%/*}"

                PROMPT_PATH="${GIT_ROOT}${PATH_TO_CURRENT}/"
            fi
        else
            PROMPT_PATH=$(print -P %3~)
            PROMPT_PATH="${PROMPT_PATH%/*}/"
        fi
    fi
    echo "${PROMPT_PATH}%{$fg_bold[cyan]%}%1~%{$reset_color%}"
}

export PROMPT=$'\n$(rb_prompt) in $(directory_name) $(git_dirty)$(need_push)\n› '
set_prompt () {
  export RPROMPT="%{$fg_bold[cyan]%}$(todo)%{$reset_color%}"
}

precmd() {
  title "zsh" "%m" "%55<...<%~"
  set_prompt
}
