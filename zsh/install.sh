if test ! $(which antidote)
then

  if test "$(uname)" = "Darwin"
  then
    echo "Installing antidote"
    brew install antidote
  fi

fi

exit 0
