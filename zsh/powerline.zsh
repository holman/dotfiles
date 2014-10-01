if [ $POWERLINE_CAPABLE -eq 0 ]
then
  powerline-daemon -q

  if [ $MAC -eq 0 ]
  then
    . ~/Library/Python/2.7/lib/**/powerline/bindings/zsh/powerline.zsh
  else
    . ~/.local/lib/**/powerline/bindings/zsh/powerline.zsh
  fi
fi

