alias reload!='. ~/.zshrc'
alias f='git grep --heading --break --line-number'
alias last-hotfix='git ls-remote --heads | grep -iE "\/hotfix-\d{4}$" | cut -d"/" -f3 | tail -n1'

alias myw="cd ~MyWsb"
alias hard="git reset --hard"
alias 8080="lsof -n -i4TCP:8080"





alias cls='clear' # Good 'ol Clear Screen command
