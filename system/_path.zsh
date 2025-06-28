export PATH="./bin:/usr/local/bin:/usr/local/sbin:$ZSH/bin:/opt/homebrew/opt/postgresql@11/bin:$PATH"
export PATH="$HOME/.bun/bin:$PATH"
export MANPATH="/usr/local/man:/usr/local/mysql/man:/usr/local/git/man:$MANPATH"

# Remove duplicate entries from $PATH
typeset -U path
