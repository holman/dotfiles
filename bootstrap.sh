#!/bin/bash

# set -x

function git_clone() {
  cd $2
  git clone git@github.com:$1.git
}

PKG_LIST_COMMON="build-essential git zsh"
PKG_LIST_MAC=""
PKG_LIST_LINUX=""

if [ -d /Library ]; then
  echo "Bootstraping Mac ..."
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
  brew install ${PKG_LIST_COMMON} ${PKG_LIST_MAC}
  git_clone ghasemnaddaf/dotfiles $HOME
else
  echo "Bootstraping Linux ..."
  DEBIAN_FRONTEND=noninteractive apt-get install ${PKG_LIST_COMMON} ${PKG_LIST_LINUX} 
fi

cat /dev/zero | ssh-keygen -q -f $HOME/.ssh/id_rsa -N ""

mkdir -p $HOME/.git
echo please enter your GITHUB_PAT && read -s GPAT && echo $GPAT | tee $HOME/.git/.pat && chmod 600 $HOME/.git/.pat 

KEY=$(cat $HOME/.ssh/id_rsa.pub)
curl -X POST -H "Accept: application/vnd.github.v3+json" \
  -H "Authorization: token $GPAT" https://api.github.com/user/keys \
  -d "{\"key\": \"${KEY}\"}"

git_clone ghasemnaddaf/dotfiles $HOME
git_clone ghasemnaddaf/ohmyzsh $HOME
