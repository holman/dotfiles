#!/bin/sh
apps=(
    onepassword
    adobe-creative-cloud
    alfred
    amazon-music
    anvil
    arduino
    dropbox
    flux
    gfxcardstatus
    google-chrome
    google-drive
    handbrake
    hipchat
    iterm2
    kindle
    makemkv
    mamp
    postgres
    skitch
    skype
    spectacle
    spotify
    transmit
    virtualbox
    vagrant
    vagrant-manager
    vlc
)

echo "Tap cask"
brew tap caskroom/cask

echo "Install brew-cask"
brew install caskroom/cask/brew-cask

for app in ${apps[*]}
do
    echo "Installing $app"
    brew cask install $app
done

echo "modify Alfred's scope to include the Caskroom"
brew cask alfred link

echo "cleanup cask"
brew cask cleanup
