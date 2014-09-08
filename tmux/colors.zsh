ls /usr/share/terminfo/*|grep screen-256color > /dev/null
code=$?
if [[ $code = 0 ]]
then
  TERM=screen-256color
else
  TERM=xterm-256color
fi
