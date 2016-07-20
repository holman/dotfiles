
if test $(which npm)
then
    echo "Installing npm global modules"
    npm install -g cordova eslint tern
fi
