if [ $POWERLINE_CAPABLE ]
then
  powerline-daemon -q

  . ~/.local/lib/**/powerline/bindings/zsh/powerline.zsh
fi

