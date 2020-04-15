if test $(command -v brew); then
  if test ! $(command -v node)
  then
    echo 'Installing node ...'
    brew install node
  fi

  if test ! $(command -v yarn)
  then
    echo 'Installing yarn'
    brew install yarn
  fi
fi

if test ! $(command -v spoof)
then
  if test $(command -v npm)
  then
    echo 'Installing spoof ...'
    sudo npm install spoof -g
  fi
fi
