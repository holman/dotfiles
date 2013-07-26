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