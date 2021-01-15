alias reload!='. ~/.zshrc'

alias cls='clear' # Good 'ol Clear Screen command

# open files
alias -s {yml,yaml}=vim
alias -s {tf,tfvars}=vim

# some handy curl aliases
alias curlb="curl -s -o /dev/null -w '%{time_starttransfer}\n'"
