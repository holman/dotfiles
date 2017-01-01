# sup yarn
# https://yarnpkg.com

if (( $+commands[yarn] ))
  export PATH="$PATH:`yarn global bin`"
then
