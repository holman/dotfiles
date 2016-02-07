cd ~/.nvm
git checkout `git describe --abbrev=0 --tags`

nvm install 0.10
nvm alias default 0.10

nvm use 0.10

npm install bower grunt-cli -g
