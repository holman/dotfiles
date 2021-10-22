#!/bin/bash -e

if [ "$(uname)" == "Darwin" ]; then
  source $DOTS/common/brew.sh
  brew_install llvm
  # Force it into PATH
  sudo ln -sf "$(brew list llvm | grep 'bin/clangd$' | head -n1)" /usr/local/bin
elif [[ "$(lsb_release -i)" == *"Ubuntu"* ]]; then
  # install latest
  clangd_version=11
  codename=$(lsb_release -c | cut -f2)
  wget -O - https://apt.llvm.org/llvm-snapshot.gpg.key | sudo apt-key add -
  sudo apt-add-repository "deb https://apt.llvm.org/${codename}/ llvm-toolchain-${codename}-${clangd_version} main"
  source $DOTS/common/apt.sh
  apt_install clangd-${clangd_version}
  sudo update-alternatives --install /usr/bin/clangd clangd /usr/bin/clangd-${clangd_version} 100
  sudo update-alternatives --set clangd /usr/bin/clangd-${clangd_version}
fi
