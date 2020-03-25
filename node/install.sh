if test ! $(which spoof)
then
  if test $(which npm)
  then
    npm install yarn -g
    npm install spoof -g
  fi
fi
