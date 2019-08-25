from ubuntu:trusty

run apt-get update
run apt-get install -y lsb-core
copy ./ /root/.dotfiles
# TODO This should not be necessary
workdir /root/.dotfiles
run yes | /root/.dotfiles/script/bootstrap
run yes | /root/.dotfiles/script/install
# TODO This does not work as the shell is not properly recognized as interactive
run /root/.dotfiles/script/test
