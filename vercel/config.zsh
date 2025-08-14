# Vercel CLI aliases and shortcuts
alias v='vercel'
alias vd='vercel dev'
alias vb='vercel build'
alias vp='vercel --prod'
alias vl='vercel logs'
alias vs='vercel secrets'
alias vls='vercel list'
alias vln='vercel link'
alias venv='vercel env'

# Vercel deployment shortcuts
alias deploy='vercel --prod'
alias preview='vercel'
alias dev='vercel dev'

# Vercel project management
alias v-init='vercel init'
alias v-pull='vercel pull'
alias v-inspect='vercel inspect'
alias v-domains='vercel domains'
alias v-certs='vercel certs'

# Vercel environment management
alias v-env-ls='vercel env ls'
alias v-env-add='vercel env add'
alias v-env-rm='vercel env rm'
alias v-env-pull='vercel env pull'

# Quick deployment with custom message
vdeploy() {
  if [ -n "$1" ]; then
    git add -A && git commit -m "$1" && git push && vercel --prod
  else
    echo "Usage: vdeploy 'commit message'"
  fi
}