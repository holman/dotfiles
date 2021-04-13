#!/bin/bash

# set -x

function git_clone() {
  cd $2
  git clone git@github.com:$1.git
}

PKG_LIST_COMMON="git zsh"
PKG_LIST_MAC=""
PKG_LIST_CASK_MAC="iterm2"
PKG_LIST_LINUX="build-essential"

if test "$(uname)" = "Darwin"; then
  echo "Bootstraping Mac ..."
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
  brew install ${PKG_LIST_COMMON} ${PKG_LIST_MAC}
  brew install --cask ${PKG_LIST_CASK_MAC}
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
pushd $HOME/dotfiles && ./script/bootstrap && popd

/bin/bash -c "REMOTE=git@github.com:ghasemnaddaf/ohmyzsh.git BRANCH=my_changes \
    $(curl -fsSL https://raw.githubusercontent.com/ghasemnaddaf/ohmyzsh/my_changes/tools/install.sh)"

PIP_INSTALL="yq jq"
pip3 install ${PIP_INSTALL}
