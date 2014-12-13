function title() {
  case $TERM in
  screen|screen-256color)
    precmd () {
      local prefix
      prefix=""
      if is-vi-suspended; then
        prefix="(vim):"
      fi
      print -Pn "\ek$prefix%21<...<%~\e\\" # screen title (in ^A")
    }
    preexec () {
      local command
      local formatted_title
      # only print name of command without arguments
      command=$(echo "$1" | cut -d" " -f1)
      formatted_title="${command/\(//}:%21<...<%~"
      if [[ $command == "vim" ]]; then
        export VIM_TITLE=$formatted_title
      fi
      print -Pn "\ek$formatted_title\e\\" # screen title (in ^A")
    }
    ;;
  xterm*|rxvt)
    print -Pn "\e]2;%m:%21<...<%~\a" # print hostname:pwd for xterm title
    ;;
  esac
}

if [[ -n $TMUX ]]; then
  export TMUX_SESSION="$(tmux display-message -p '#S')"
fi

function restore_vim_title() {
  print -Pn "\ek$VIM_TITLE\e\\" # screen title (in ^A")
}
