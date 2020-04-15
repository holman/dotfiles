# sup yarn
# https://yarnpkg.com

if (( $+commands[yarn] ))
then
  echo 'Adding yarn to path'
  export PATH="$PATH:`yarn global bin`"
fi
