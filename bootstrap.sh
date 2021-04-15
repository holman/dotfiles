#!/bin/bash

# set -x

function git_clone() {
  git clone git@github.com:$1.git $2
}

PKG_LIST_COMMON="awscli git teleport vim zsh"
PKG_LIST_MAC="jq"
PKG_LIST_CASK_MAC="docker google-chrome iterm2 virtualbox"
PKG_LIST_LINUX="build-essential curl dmidecode docker.io python3 python3-pip"

if test "$(uname)" = "Darwin"; then
  echo "Bootstraping Mac ..."
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
  brew install ${PKG_LIST_COMMON} ${PKG_LIST_MAC}
  brew install --cask ${PKG_LIST_CASK_MAC}
else 
  echo "Bootstraping Linux ..."
  
  # repo for teleport
  curl https://deb.releases.teleport.dev/teleport-pubkey.asc | sudo apt-key add -
  sudo add-apt-repository 'deb https://deb.releases.teleport.dev/ stable main'

  sudo apt-get update
  DEBIAN_FRONTEND=noninteractive sudo apt-get install ${PKG_LIST_COMMON} ${PKG_LIST_LINUX} 
fi

# key and git
cat /dev/zero | ssh-keygen -q -f $HOME/.ssh/id_rsa -N ""

mkdir -p $HOME/.git
echo please enter your GITHUB_PAT && read -s GPAT && echo $GPAT | tee $HOME/.git/.pat && chmod 600 $HOME/.git/.pat 

KEY=$(cat $HOME/.ssh/id_rsa.pub)
curl -X POST -H "Accept: application/vnd.github.v3+json" \
  -H "Authorization: token $GPAT" https://api.github.com/user/keys \
  -d "{\"key\": \"${KEY}\"}"

# dotfiles
git_clone ghasemnaddaf/dotfiles $HOME/.dotfiles
pushd $HOME/.dotfiles
./script/bootstrap
./script/install
popd

# ohmyzsh
/bin/bash -c "ZSH= REMOTE=git@github.com:ghasemnaddaf/ohmyzsh.git BRANCH=my_changes \
    $(curl -fsSL https://raw.githubusercontent.com/ghasemnaddaf/ohmyzsh/my_changes/tools/install.sh)"

# python
PIP_INSTALL="yq"
sudo pip3 install ${PIP_INSTALL}


