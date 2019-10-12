function get_host_from_ssh() {
  ssh -G &> /dev/null
  if [ $? -eq 0 ]; then
    get_host_from_ssh_config "$@"
  else
    get_host_from_ssh_legacy "$@"
  fi
}

function get_host_from_ssh_legacy() {
  echo "$1"
}

function get_host_from_ssh_config() {
  local command
  local head
  local tail
  local hostname

  command=$*
  head=$(echo "$command" | cut -d " " -f1)
  tail=$(echo "$command" | cut -d " " -f2-)

  hostname=echo $(echo "$head -G $tail") | awk '/^hostname/ { print $2 }'
  echo "$hostname"
}

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
      if [[ $command == "ssh" ]]; then
        formatted_title="$(get_host_from_ssh "$1")"
      fi
      print -Pn "\ek$formatted_title\e\\" # screen title (in ^A")
      # TODO disentangle from the reset
      refresh_environment
    }
    ;;
  xterm*|rxvt)
    print -Pn "\e]2;%m:%21<...<%~\a" # print hostname:pwd for xterm title
    ;;
  esac
}

function restore_vim_title() {
  print -Pn "\ek$VIM_TITLE\e\\" # screen title (in ^A")
}
