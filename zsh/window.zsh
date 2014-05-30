# From http://dotfiles.org/~_why/.zshrc
# Sets the window title nicely no matter where you are
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
    print -Pn "\e]2;$2\a" # plain xterm title ($3 for pwd)
    ;;
  esac
}

if [[ -n $TMUX ]]; then
  export TMUX_SESSION="$(tmux display-message -p '#S')"
fi
