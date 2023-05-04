# test if the fnm is installed using command -v
CURRNODEVERSION=v18.16.0
if command -v fnm &> /dev/null
then
    if ! fnm ls | grep -q $CURRNODEVERSION; then
        echo "Installing node $CURRNODEVERSION"
        fnm install $CURRNODEVERSION
        # fnm use $CURRNODEVERSION
    fi
fi



