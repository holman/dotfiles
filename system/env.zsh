EDITOR='vim'

autoload zmv

if [ $MAC -ne 0 ]
then
  setxkbmap -option caps:escape
  setxkbmap -option compose:ralt
fi
