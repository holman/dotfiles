export ZSH=~/.oh-my-zsh

ZSH_THEME="robbyrussell"
DEFAULT_USER=$(whoami)

plugins=(docker git z)

source $ZSH/oh-my-zsh.sh
source /usr/local/share/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh
