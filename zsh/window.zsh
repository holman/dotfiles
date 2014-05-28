# From http://dotfiles.org/~_why/.zshrc
# Sets the window title nicely no matter where you are
function title() {
  # escape '%' chars in $1, make nonprintables visible
  a=${(V)1//\%/\%\%}

  # Truncate command, and join lines.
  a=$(print -Pn "%40>...>$a" | tr -d "\n")

  workingdir=$(print -Pn "%~")
  curcmd=$(print -Pn "$a")

  case $TERM in
  screen|screen-256color)
    if [[ $workingdir == $curcmd ]]; then
      print -Pn "\ek$a\e\\" # screen title (in ^A")
    else
      print -Pn "\ek$a:%~\e\\" # screen title (in ^A")
    fi
    ;;
  xterm*|rxvt)
    print -Pn "\e]2;$2\a" # plain xterm title ($3 for pwd)
    ;;
  esac
}

