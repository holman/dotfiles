export EDITOR='pstorm'
export GPG_TTY=$(tty)
export WD_HOME="$HOME/.wd"
export NVM_DIR="$HOME/.nvm"
export TMUX_DIR="$HOME/.tmux"
export ELEANOR_DODO="$HOME/Nextcloud/Naissance/Dodo"
export ANDROID_SDK_ROOT="/Users/he8us/Library/Android/sdk"
export ANDROID_HOME=$ANDROID_SDK_ROOT
export PYTHON_USER_DIR="$(python3 -m site --user-base)/bin"

source "$NVM_DIR/nvm.sh"

#source $(brew --prefix)/etc/grc.bashrc

fpath=($WD_HOME $fpath)
