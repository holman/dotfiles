#!/bin/zsh

# Shamelessly copied from oh-my-zsh

function _current_epoch() {
  local current_time
  current_time=$(print -P '%D{%s}')
  echo $(($current_time / 60 / 60 / 24))
}

function _update_dots_update() {
  echo "LAST_EPOCH=$(_current_epoch)" > ~/.dots-update
}

function _upgrade_dots() {
  /usr/bin/env DOTS=$DOTS /bin/zsh $DOTS/script/upgrade.sh
  # update the dots file
  _update_dots_update
}

epoch_target=$UPDATE_DOTS_DAYS
if [[ -z "$epoch_target" ]]; then
  # Default to old behavior
  epoch_target=1
fi

#[ -f ~/.profile ] && source ~/.profile

if [ -f ~/.dots-update ]
then
  . ~/.dots-update

  if [[ -z "$LAST_EPOCH" ]]; then
    _update_dots_update && return 0;
  fi

  epoch_diff=$(($(_current_epoch) - $LAST_EPOCH))
  if [ $epoch_diff -ge $epoch_target ]
  then
    _upgrade_dots
    # update the dots file
    _update_dots_update
  fi
else
  # create the zsh file
  _update_dots_update
fi


