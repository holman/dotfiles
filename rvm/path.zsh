if (( $+commands[rvm] ))
then
  export rvm_max_time_flag=20 # increase timeout for install
  export PATH="$PATH:$HOME/.rvm/bin"

  [[ -s "$HOME/.rvm/scripts/rvm" ]] && source "$HOME/.rvm/scripts/rvm" # Load RVM into a shell session *as a function*
fi
