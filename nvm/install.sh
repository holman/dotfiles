export NVM_DIR="$HOME/.nvm"
source $(brew --prefix nvm)/nvm.sh

nvm install 0.10

npm -g install npm@latest

nvm alias default 0.10

nvm use 0.10

npm install bower grunt-cli -g
