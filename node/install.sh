echo "Installing npm global modules"

if test ! $(which npm)
then
  npm install -g spoof cordova eslint
fi
