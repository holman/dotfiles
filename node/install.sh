# installs node version management
if test ! $(which n)
then
  if test $(which npm)
  then 
    echo -e "\033[1;33m› Installing node version manager N..\033[0m"
    sudo npm install -g n
  fi
fi
