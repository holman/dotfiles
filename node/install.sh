# installs node version management
if test ! $(which n)
then
  if test $(which npm)
  then
    sudo npm install -g n
  fi
fi
