# write sane gnome 3 defaults

# workspaces span monitors (otherwise one is static)
gsettings set org.gnome.shell.overrides workspaces-only-on-primary false
# prevent alt-tab from showing apps on all workspaces
gsettings set org.gnome.shell.app-switcher current-workspace-only true
# disable animations - speeds up workspace switching
gsettings set org.gnome.desktop.interface enable-animations "false"

# remove junk
sudo apt remove -y aisleriot cheese gnome-clocks gnome-dictionary gnome-mahjongg gnome-mines gnome-nibbles gnome-robots gnome-sound-recorder gnome-sudoku hitori libreoffice* simple-scan swell-foop thunderbird

# add icon theme
mkdir $icon_dir
git clone https://github.com/keeferrourke/la-capitaine-icon-theme.git $icon_dir

# fix gnome's handling of wallpapers
rm -r ~/.cache/gnome-control-center/backgrounds
ln -s $HOME/Pictures/Wallpapers/ $HOME/.cache/gnome-control-center/backgrounds
