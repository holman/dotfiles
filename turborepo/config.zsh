# Turborepo aliases and shortcuts
alias t='turbo'
alias tb='turbo build'
alias td='turbo dev'
alias tt='turbo test'
alias tl='turbo lint'
alias tc='turbo clean'
alias tr='turbo run'

# Turborepo with specific scope
alias tb-app='turbo build --filter=app'
alias td-app='turbo dev --filter=app'
alias tb-docs='turbo build --filter=docs'
alias td-docs='turbo dev --filter=docs'

# Turborepo cache management
alias tcache='turbo build --cache-dir=.turbo'
alias tnocache='turbo build --no-cache'
alias tcache-clear='rm -rf .turbo'

# Turborepo development workflow
alias tdev='turbo dev --parallel'
alias tbuild='turbo build --parallel'
alias ttest='turbo test --parallel'

# Turborepo project creation
alias create-turbo='npx create-turbo@latest'

# Turborepo utilities
turbo-info() {
  echo "Turborepo Project Information:"
  echo "============================="
  if [ -f "turbo.json" ]; then
    echo "Turbo config found: turbo.json"
    echo "Packages:"
    if command -v jq &> /dev/null && [ -f "package.json" ]; then
      node -p "JSON.stringify(require('./package.json').workspaces || [], null, 2)"
    else
      echo "  (install jq for detailed package info)"
    fi
  else
    echo "No turbo.json found in current directory"
  fi
}

turbo-clean-all() {
  echo "Cleaning all Turborepo artifacts..."
  rm -rf .turbo
  rm -rf */.turbo
  rm -rf */node_modules/.cache
  rm -rf */dist
  rm -rf */build
  rm -rf */.next
  echo "Clean complete!"
}

# Turborepo workspace helpers
trun() {
  if [ -z "$1" ]; then
    echo "Usage: trun <script> [workspace]"
    echo "Example: trun build @myapp/web"
    return 1
  fi
  
  if [ -n "$2" ]; then
    turbo run "$1" --filter="$2"
  else
    turbo run "$1"
  fi
}