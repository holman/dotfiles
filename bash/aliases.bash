alias tmux="tmux -2"

# System
alias ..="cd .."
alias ls="ls -lah"

# Flush DNS Cache
alias flushdns="dscacheutil -flushcache"

# Recursively delete .DS_Store files
# http://alex.tsd.net.au/2010/09/14/recursively-remove-ds_store-files/
alias cleanup="find . -name '*.DS_Store' -type f -delete"

# instant simple server
# https://gist.github.com/1525217
alias server="open http://localhost:8000 && python -m SimpleHTTPServer"

# git grep
alias gg="git grep"

# global agignore
alias ag="ag --path-to-agignore=~/.agignore"

# kill process(es) on certain port
killPortProcess() {
  kill `lsof -t -i:$1`
}
alias killport=killPortProcess

