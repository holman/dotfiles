export EDITOR='phpstorm'
export GPG_TTY=$(tty)
export WD_HOME="$HOME/.wd"
export NVM_DIR="$HOME/.nvm"
export TMUX_DIR="$HOME/.tmux"
export TMUX_PLUGIN_MANAGER_PATH="$TMUX_DIR/plugins/tpm"
export ANDROID_HOME=$ANDROID_SDK_ROOT
export PYTHON_USER_DIR="$(python3 -m site --user-base)/bin"
export PKG_CONFIG_PATH="/usr/local/opt/icu4c/lib/pkgconfig"
export LDFLAGS="-L/usr/local/opt/icu4c/lib"
export CPPFLAGS="-I/usr/local/opt/icu4c/include"

source "$NVM_DIR/nvm.sh"

#source $(brew --prefix)/etc/grc.bashrc

fpath=($WD_HOME $fpath)

export STM32_PRG_PATH=/Applications/STMicroelectronics/STM32Cube/STM32CubeProgrammer/STM32CubeProgrammer.app/Contents/MacOs/bin
