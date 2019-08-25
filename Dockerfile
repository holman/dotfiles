from ubuntu:trusty

run apt-get update
run apt-get install -y zsh git
run apt-get install -y vim
run apt-get install -y curl wget
run apt-get install -y lsb-core
copy ./ /root/.dotfiles
# This should not be necessary
workdir /root/.dotfiles
run yes | /root/.dotfiles/script/bootstrap
run yes | /root/.dotfiles/script/install
