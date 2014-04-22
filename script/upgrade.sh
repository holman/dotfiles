# Shamelessly copied from oh my zsh

printf '\033[0;34m%s\033[0m\n' "Upgrading Dotfiles"
cd "$DOTS"
if git pull --rebase --stat origin master
then
  printf '\033[0;34m%s\033[0m\n' 'Dotfiles updated to current version.'
  printf '\033[0;34m%s\033[0m\n' 'Bootstrapping dotfiles.'
  "$DOTS/script/bootstrap"
  printf '\033[0;34m%s\033[0m\n' 'You might have to run script/install.'
else
  printf '\033[0;31m%s\033[0m\n' 'There was an error updating. Try again later?'
fi
