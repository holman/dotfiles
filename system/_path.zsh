export PATH="./bin:/usr/local/bin:/usr/local/sbin:$ZSH/bin:$PATH"
export MANPATH="/usr/local/man:/usr/local/mysql/man:/usr/local/git/man:$MANPATH"

if [[ "$(uname)" = "Linux" ]]; then
  #alias tmux='tmux -2 -f ~/.tmux-osx.conf'
  export PATH="$HOME/.linuxbrew/bin:$PATH"
else
  #alias tmux='tmux -2'
fi
