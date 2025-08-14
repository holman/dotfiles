# PlanetScale CLI aliases and shortcuts
alias ps='pscale'
alias psl='pscale database list'
alias psc='pscale database create'
alias psd='pscale database delete'

# Branch management
alias psb='pscale branch'
alias psbl='pscale branch list'
alias psbc='pscale branch create'
alias psbd='pscale branch delete'
alias psbp='pscale branch promote'

# Connection shortcuts
alias psh='pscale shell'
alias psx='pscale connect'
alias psproxy='pscale connect --execute-protocol'

# Deploy requests
alias psdr='pscale deploy-request'
alias psdrl='pscale deploy-request list'
alias psdrc='pscale deploy-request create'
alias psdra='pscale deploy-request deploy'
alias psdrx='pscale deploy-request cancel'

# Service tokens
alias pst='pscale service-token'
alias pstl='pscale service-token list'
alias pstc='pscale service-token create'
alias pstd='pscale service-token delete'

# Authentication
alias psauth='pscale auth'
alias pslogin='pscale auth login'
alias pslogout='pscale auth logout'

# Quick database connection with sensible defaults
psconnect() {
  if [ -z "$1" ] || [ -z "$2" ]; then
    echo "Usage: psconnect <database> <branch>"
    echo "Example: psconnect myapp main"
    return 1
  fi
  
  pscale connect "$1" "$2" --port 3309 --execute-protocol
}