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

alias llcount='ll | wc -l'
alias md5-deep='find -s . -type f -exec md5 {} \; >> file.md5'
alias dnscacheclear='sudo killall -HUP mDNSResponder'
alias uninstall-gems='gem list | cut -d" " -f1 | xargs sudo gem uninstall -aIx'
