export EDITOR='pstorm'
export GPG_TTY=$(tty)
export WD_HOME="$HOME/.wd"
export NVM_DIR="$HOME/.nvm"

source "$NVM_DIR/nvm.sh"

source $(brew --prefix)/etc/grc.bashrc

fpath=($WD_HOME $fpath)
