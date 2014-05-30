function title() {
  case $TERM in
  screen|screen-256color)
    precmd () {
      print -Pn "\ek%21<...<%~\e\\" # screen title (in ^A")
    }
    preexec () {
      print -Pn "\ek$1:%21<...<%~\e\\" # screen title (in ^A")
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
