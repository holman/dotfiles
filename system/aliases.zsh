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

# network
alias wol_asl="wakeonlan 00:0f:fe:f0:aa:92"
alias wol_psl="wakeonlan f8:0f:41:18:b1:21"

