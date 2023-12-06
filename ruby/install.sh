if test ! $(which rbenv)
then

  if test "$(uname)" = "Darwin"
  then
    echo "Installing rbenv"
    brew install rbenv ruby-build
  fi

fi

exit 0
