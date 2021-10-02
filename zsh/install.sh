#!/bin/bash -ex
set -e

checkout_path=~/.oh-my-zsh

cd "$(dirname "$0")"

if [ "$(uname -s)" = "Darwin" ]; then
  source $DOTS/common/brew.sh
  brew_install zsh
elif [[ "$(lsb_release -i)" == *"Ubuntu"* ]]; then
  sudo apt-get install -y zsh
fi

if [ -d "$checkout_path" ]; then
  if [[ "x${ZSH}" == "x" ]]; then
    # Older zsh templates did not export ZSH var
    export ZSH=$checkout_path
  fi
  zsh -i -c "source ${checkout_path}/lib/functions.zsh && upgrade_oh_my_zsh"
else
  ../git/install.sh
  git clone git://github.com/robbyrussell/oh-my-zsh.git $checkout_path
fi

if (grep -q '/bin/zsh' /etc/shells) && [[ -x /bin/zsh ]]; then
  if [[ "${CI}" == "true" ]]; then
    echo "Running on CI, not changing log in shell"
  else
    chsh -s /bin/zsh
  fi
fi

