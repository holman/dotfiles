# Next.js development aliases
alias ndev='npm run dev'
alias nbuild='npm run build'
alias nstart='npm run start'
alias nlint='npm run lint'
alias ntest='npm run test'
alias ntype='npm run type-check'

# Next.js with yarn
alias ydev='yarn dev'
alias ybuild='yarn build'
alias ystart='yarn start'
alias ylint='yarn lint'
alias ytest='yarn test'
alias ytype='yarn type-check'

# Next.js project creation
alias create-next='npx create-next-app@latest'
alias create-next-ts='npx create-next-app@latest --typescript'

# Next.js debugging and optimization
alias next-analyze='ANALYZE=true npm run build'
alias next-bundle='npx @next/bundle-analyzer'

# Common Next.js environment variables
export NEXT_TELEMETRY_DISABLED=1  # Disable Next.js telemetry

# Next.js development helpers
next-clean() {
  echo "Cleaning Next.js build artifacts..."
  rm -rf .next
  rm -rf out
  rm -rf node_modules/.cache
  echo "Clean complete!"
}

next-info() {
  echo "Next.js Project Information:"
  echo "=========================="
  if [ -f "package.json" ]; then
    echo "Next.js version: $(node -p "require('./package.json').dependencies.next || 'Not found'")"
    echo "React version: $(node -p "require('./package.json').dependencies.react || 'Not found'")"
    echo "TypeScript: $([ -f "tsconfig.json" ] && echo "Yes" || echo "No")"
    echo "Tailwind: $(node -p "require('./package.json').dependencies.tailwindcss ? 'Yes' : 'No'" 2>/dev/null || echo "No")"
  else
    echo "No package.json found in current directory"
  fi
}