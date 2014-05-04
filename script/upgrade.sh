# Shamelessly copied from oh my zsh

printf '\033[0;34m%s\033[0m\n' "Upgrading Dotfiles"
cd "$DOTS"
oldcommit=$(git rev-parse master)
if git pull --rebase --stat origin master
then
  printf '\033[0;34m%s\033[0m\n' 'Dotfiles updated to current version.'
  printf '\033[0;34m%s\033[0m\n' 'Bootstrapping dotfiles.'
  newcommit=$(git rev-parse master)
  if [[ $oldcommit != $newcommit ]]; then
    "$DOTS/script/bootstrap"
    printf '\033[0;34m%s\033[0m\n' 'You might have to run script/install.'
  else
    printf '\033[0;34m%s\033[0m\n' 'No updates found.'
  fi
else
  printf '\033[0;31m%s\033[0m\n' 'There was an error updating. Try again later?'
fi
