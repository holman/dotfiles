# Don't try to glob with zsh so you can do
# stuff like ga *foo* and correctly have
# git add the right stuff
alias git='noglob git'
