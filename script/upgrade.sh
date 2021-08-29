#!/bin/zsh
# Shamelessly copied from oh my zsh

printf '\033[0;34m%s\033[0m\n' "Upgrading Dotfiles"
cd "$DOTS"
oldcommit=$(git rev-parse master)
if git fetch origin && git rebase origin/master master
then
  newcommit=$(git rev-parse master)
  if [[ $oldcommit != $newcommit ]]; then
    printf '\033[0;34m%s\033[0m\n' 'Dotfiles updated to current version.'
    printf '\033[0;34m%s\033[0m\n' "Please run $DOTS/script/bootstrap"
    printf '\033[0;34m%s\033[0m\n' 'You might also have to run script/install.'
  else
    printf '\033[0;34m%s\033[0m\n' 'No updates found.'
  fi

  if ! git --no-pager diff --exit-code master..origin/master > /dev/null; then
    printf '\033[0;31m%s\033[0m\n' 'You have pending, local changes. Use dot-export or push them.'
  fi
else
  printf '\033[0;31m%s\033[0m\n' 'There was an error updating. Try again later?'
fi

printf '\033[0;34m%s\033[0m\n' "Running cleanup tasks"
cleanup_tasks=$(find . -name cleanup.sh)
for cleanup in ${cleanup_tasks}; do
  echo -e "Running \e[32m${cleanup}\e[0m"
  sh -c "${cleanup}"
done
