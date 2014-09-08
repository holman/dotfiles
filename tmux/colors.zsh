ls /usr/share/terminfo/*|grep screen-256color 2&>1 > /dev/null
code=$?
if [[ $code = 0 ]]
then
  TERM=screen-256color
else
  TERM=xterm-256color
fi
