#!/bin/bash

# set -x

function git_clone() {
  git clone git@github.com:$1.git $2
}

PKG_LIST_COMMON="awscli flake8 git golang packer teleport tree vim wget zsh"
PKG_LIST_MAC="jq"
PKG_LIST_CASK_MAC="docker-toolbox google-chrome iterm2 virtualbox"
PKG_LIST_LINUX="build-essential cmake curl dmidecode docker.io python3 python3-pip virtualbox"

if test "$(uname)" = "Darwin"; then
  echo "Bootstraping Mac ..."
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
  brew install ${PKG_LIST_COMMON} ${PKG_LIST_MAC}
  brew install --cask ${PKG_LIST_CASK_MAC}

  # enable sshd
  sudo systemsetup -setremotelogin on
  sudo systemsetup -getremotelogin
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

mkdir -p $HOME/.git $HOME/git
echo please enter your GITHUB_PAT && read -s GPAT && echo $GPAT | tee $HOME/.git/.pat && chmod 600 $HOME/.git/.pat 

echo "Adding $HOME/.ssh/id_rsa.pub to your github keys."

KEY=$(cat $HOME/.ssh/id_rsa.pub)
RET=$(curl -X POST -w "%{HTTP_CODE}" -H "Accept: application/vnd.github.v3+json" \
  -H "Authorization: token $GPAT" https://api.github.com/user/keys \
  -d "{\"key\": \"${KEY}\"}")
HTTP_CODE=$(echo $RET | tail -n 1)
if [ "${HTTP_CODE}" != "200" ]; then
  echo "error adding pubkey: $RET"
  echo "This can appen if your GITHUB_PAT is not assigned admin:public_key:read|write scope."
  echo "In this case, you would need to manually add the key and comment out above step."
  exit 1
fi


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


