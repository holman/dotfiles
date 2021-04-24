#!/bin/bash -x

if test "$(uname)" = "Darwin"; then
    wget https://code.visualstudio.com/sha/download\?build\=stable\&os\=darwin-universal -O vscode.zip
    unzip vscode.zip
    # cask it
    sudo mv ./Visual\ Studio\ Code.app  /Applications/
    sudo xattr -r -d com.apple.quarantine /Applications/Visual\ Studio\ Code.app
    sudo ln -s /Applications/Visual\ Studio\ Code.app/Contents/Resources/app/bin/code /usr/local/bin/code
    rm -rf ./vscode.zip ./Visual\ Studio\ Code.app
    # settings.json
    cp ${DOTFILES}/vscode/settings.json.mac ~/Library/Application\ Support/Code/User/settings.json
    # keep in dock
    defaults write com.apple.dock persistent-apps -array-add "<dict><key>tile-data</key><dict><key>file-data</key><dict><key>_CFURLString</key><string>/Applications/Visual Studio Code.app</string><key>_CFURLStringType</key><integer>0</integer></dict></dict></dict>"; killall Dock
else
    sudo snap install --classic code
fi

${DOTFILES}/vscode/install_extensions.sh

