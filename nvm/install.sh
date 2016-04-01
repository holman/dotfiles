export NVM_DIR="$HOME/.nvm"

git clone https://github.com/creationix/nvm.git $NVM_DIR
cd $NVM_DIR
git checkout `git describe --abbrev=0 --tags`

source $NVM_DIR/nvm.sh

nvm install 0.12
nvm alias default 0.12
nvm use 0.12

npm install npm@latest -g
npm install bower grunt-cli gulp-cli webpack webpack-dev-server -g
