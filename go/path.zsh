if (( $+commands[go] ))
then
  export GOPATH=$DEVEL/go
  export PATH="$PATH:$GOPATH/bin"
fi
