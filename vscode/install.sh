if test "$(uname)" = "Darwin"; then
    wget https://code.visualstudio.com/sha/download\?build\=stable\&os\=darwin-universal -O vscode.zip
    unzip vscode.zip
    # cask it
    sudo mv ./Visual\ Studio\ Code.app  /Applications/
else
    sudo snap install --classic code
fi

# copy dotfiles

# get extensions. url: https://marketplace.visualstudio.com/items?itemName=xyz
code --install-extension alphabotsec.vscode-eclipse-keybindings
code --install-extension ms-vscode.cpptools
code --install-extension ms-azuretools.vscode-docker
