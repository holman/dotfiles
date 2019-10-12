function _change_iterm_colorscheme() {
  if [ -n "$TMUX" ]; then
    echo "Detected a tmux session. This only works outside of tmux."
    return 1
  fi
  local color_preset
  color_preset="$1"
  echo -e "\033]1337;SetColors=preset=${color_preset}\a"
}

function _change_colorscheme() {
  if [[ -n "$ITERM_SESSION_ID" ]]; then
    _change_iterm_colorscheme "$1"
    return $?
  else
    echo "Unsupported terminal"
    return 1
  fi
}

function change_color() {
  local colorscheme
  local fgbg
  if [ "$1" = "dark" ]; then
    colorscheme='Solarized Dark'
    fgbg="15;0"
  elif [ "$1" = "light" ]; then
    colorscheme='Solarized Light'
    fgbg="0;15"
  else
    echo "Unknown colorscheme"
  fi

  local rc
  _change_colorscheme "$colorscheme"
  rc=$?
  export COLORFGBG=$fgbg
  return $rc
}

# TODO needs to be part of zsh start up
# TODO test with long running tmux session

