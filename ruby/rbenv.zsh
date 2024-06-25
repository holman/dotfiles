# init according to man page
if (( $+commands[rbenv] ))
then
  eval "$(rbenv init -)"
fi

if [ -d "/opt/homebrew/opt/ruby/bin" ]; then
  export PATH=/opt/homebrew/opt/ruby/bin:$PATH
  export PATH=`gem environment gemdir`/bin:$PATH
fi
