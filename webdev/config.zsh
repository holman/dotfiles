# Modern Web Development Configuration

# Disable telemetry for various tools
export NEXT_TELEMETRY_DISABLED=1
export GATSBY_TELEMETRY_DISABLED=1
export NUXT_TELEMETRY_DISABLED=1
export ASTRO_TELEMETRY_DISABLED=1

# Web development port shortcuts
alias port3000='lsof -ti:3000'
alias port8000='lsof -ti:8000'
alias port8080='lsof -ti:8080'
alias kill3000='lsof -ti:3000 | xargs kill'
alias kill8000='lsof -ti:8000 | xargs kill'
alias kill8080='lsof -ti:8080 | xargs kill'

# Local development helpers
alias serve='python3 -m http.server 8000'
alias serve-php='php -S localhost:8000'

# Modern web framework shortcuts
alias vite='npx vite'
alias astro='npx astro'
alias remix='npx remix'
alias storybook='npx storybook'

# CSS and styling tools
alias tailwind='npx tailwindcss'
alias postcss='npx postcss'
alias sass='npx sass'

# Build tool shortcuts
alias webpack='npx webpack'
alias rollup='npx rollup'
alias esbuild='npx esbuild'
alias swc='npx swc'

# Testing shortcuts for web apps
alias jest='npx jest'
alias vitest='npx vitest'
alias playwright='npx playwright'
alias cypress='npx cypress'

# Linting and formatting for web projects  
alias eslint='npx eslint'
alias prettier='npx prettier'
alias stylelint='npx stylelint'

# Quick localhost opener
open-local() {
  local port=${1:-3000}
  open "http://localhost:$port"
}

# Find and kill process on port
kill-port() {
  if [ -z "$1" ]; then
    echo "Usage: kill-port <port-number>"
    return 1
  fi
  
  local pid=$(lsof -ti:$1)
  if [ -n "$pid" ]; then
    kill -9 $pid
    echo "Killed process $pid on port $1"
  else
    echo "No process found on port $1"
  fi
}