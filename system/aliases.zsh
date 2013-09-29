# grc overides for ls
#   Made possible through contributions from generous benefactors like
#   `brew install coreutils`
if $(gls &>/dev/null)
then
  alias ls="gls -F --color"
  alias l="gls -lAh --color"
  alias ll="gls -l --color"
  alias la='gls -A --color'
fi

# makes directory and cd 
function take() { 
    mkdir -p "$1"
    cd "$1" 
}

# Quicker cd
alias cw='cd $PROJECTS'
function cr() {
 cd $PROJECTS/$*
}

#cd and clear
function cdc () {
  cd "$1"
  clear
}

#cd clear and list
function cdd () {
  cd "$1"
  clear
  pwd
  ls -lh --color=auto
}


# get full path in shell
function fp() {
    echo "`pwd`/$1"
}


#go to node modules
#TODO : refactor and put in variable
alias cdnm="cd /usr/local/share/npm/lib/node_modules && ls"
#go to dotfiles and display git status
funciton cddot () {
  cd ~/.dotfiles
  git status
}

#shorter clear
alias cls="clear"
