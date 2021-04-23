if test "$(uname)" = "Darwin"; then
    wget https://code.visualstudio.com/sha/download\?build\=stable\&os\=darwin-universal -O vscode.zip
    unzip vscode.zip
    # cask it
    sudo mv ./Visual\ Studio\ Code.app  /Applications/
    sudo xattr -r -d com.apple.quarantine /Applications/Visual\ Studio\ Code.app
    sudo ln -s /Applications/Visual\ Studio\ Code.app/Contents/Resources/app/bin/code /usr/local/bin/code
    rm -rf ./vscode.zip ./Visual\ Studio\ Code.app
    # settings.json
    cp settings.json.mac ~/Library/Application\ Support/Code/User/settings.json
else
    sudo snap install --classic code
fi

# get extensions. url: https://marketplace.visualstudio.com/items?itemName=xyz
for ext in "alphabotsec.vscode-eclipse-keybindings
            jgclark.vscode-todo-highlight
            ms-vscode.cpptools
            ms-python.python
            ms-azuretools.vscode-docker
            waderyan.gitblame"; do

    code --install-extension $ext
done
