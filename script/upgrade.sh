#!/bin/zsh

cd "$DOTS"

/usr/bin/env /bin/zsh ~/.oh-my-zsh/tools/upgrade.sh
/bin/zsh $DOTS/script/upgrade_dotfiles.sh
