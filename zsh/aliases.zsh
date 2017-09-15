alias reload!='. ~/.zshrc'
alias f='git grep --heading --break --line-number'
alias last-hotfix='git ls-remote --heads | grep -iE "\/hotfix-\d{4}$" | cut -d"/" -f3 | tail -n1'
alias prune-branches='git branch | grep -v "master" | xargs git branch -D'

alias hard="git reset --hard"
alias 8080="lsof -n -i4TCP:8080"
alias bdebuild='curl -sH "Accept-encoding: gzip" https://app.dev.wordsearchbible.com/ | gunzip - | ack "(Build: v\d+)" --output="\$1"'

alias cls='clear' # Good 'ol Clear Screen command
