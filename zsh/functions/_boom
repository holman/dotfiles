#compdef boom

local state line cmds ret=1

_arguments -C '1: :->cmds' '*: :->args'

case $state in
  cmds)
    local -a cmds
    cmds=(
      'all:show all items in all lists'
      'edit:edit the boom JSON file in $EDITOR'
      'help:help text'
    )
    _describe -t commands 'boom command' cmds && ret=0
    _values 'lists' $(boom | awk '{print $1}')
    ;;
  args)
    case $line[1] in
      (boom|all|edit|help)
        ;;
      *)
        _values 'items' `boom $line[1] | awk '{print $1}' | sed -e 's/://'` 2>/dev/null && ret=0
        ;;
    esac
    ;;
esac

return ret
