DISABLE_AUTO_TITLE="true"

is_git() {
  [[ $(git rev-parse --is-inside-work-tree 2>/dev/null) == true ]]
}

tab_title() {
  local "BETTER_PWD"
  if is_git; then
   BETTER_PWD=$(git rev-parse --show-toplevel)
  else
    BETTER_PWD=$(PWD)
  fi
  
  echo -ne "\e]1;${BETTER_PWD##*/}\a"
}

add-zsh-hook precmd tab_title