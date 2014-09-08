if [ $POWERLINE_CAPABLE -eq 0 ]
then
  powerline-daemon -q

  . ~/.local/lib/**/powerline/bindings/zsh/powerline.zsh
fi

