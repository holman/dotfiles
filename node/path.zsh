# Node.js and npm configuration
export NPM_CONFIG_PREFIX="$HOME/.npm-global"
export PATH="$PATH:$HOME/.npm-global/bin"

# fnm (Fast Node Manager) setup
if command -v fnm &> /dev/null; then
  export PATH="$HOME/.fnm:$PATH"
  eval "$(fnm env)"
fi

# Yarn global bin path
export PATH="$PATH:$(yarn global bin 2>/dev/null || echo '')"

# Bun (fast package manager and runtime)
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"