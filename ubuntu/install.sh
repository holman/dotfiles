#!/bin/sh

icon_dir="$HOME/.icons/"

# write sane gnome 3 defaults

# workspaces span monitors (otherwise one is static)
gsettings set org.gnome.shell.overrides workspaces-only-on-primary false
# prevent alt-tab from showing apps on all workspaces
gsettings set org.gnome.shell.app-switcher current-workspace-only true
# disable animations - speeds up workspace switching
gsettings set org.gnome.desktop.interface enable-animations "false"

sudo apt install -y git

# remove junk
sudo apt remove -y aisleriot cheese gnome-clocks gnome-dictionary gnome-mahjongg gnome-mines gnome-nibbles gnome-robots gnome-sound-recorder gnome-sudoku hitori libreoffice* simple-scan swell-foop thunderbird xfburn xfce4-notes

# install snaps for trendyness
sudo snap install cannonical-livepatch keepassxc libreoffice
# sudo snap install --classic vscode
# sudo snap install atom

# add icon theme
mkdir $icon_dir
git clone https://github.com/keeferrourke/la-capitaine-icon-theme.git $icon_dir

# fix gnome's handling of wallpapers
rm -r ~/.cache/gnome-control-center/backgrounds
ln -s $HOME/Pictures/Wallpapers/ $HOME/.cache/gnome-control-center/backgrounds

# add repos

# sublime-text
wget -qO - https://download.sublimetext.com/sublimehq-pub.gpg | sudo apt-key add -
echo "deb https://download.sublimetext.com/ apt/stable/" | sudo tee /etc/apt/sources.list.d/sublime-text.list

# spotify
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys BBEBDCB318AD50EC6865090613B00F1FD2C19886 0DF731E45CE24F27EEEB1450EFDC8610341D9410
echo deb http://repository.spotify.com stable non-free | sudo tee /etc/apt/sources.list.d/spotify.list

sudo apt update

# install packages

sudo apt install -y chromium-browser docker docker-compose firefox spotify-client sublime-text tmux vagrant vim virtualbox

# rust
curl https://sh.rustup.rs -sSf | sh

sudo apt autoremove

cd script
./bootstrap
