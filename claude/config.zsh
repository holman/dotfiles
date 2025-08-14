# Claude Code development aliases and shortcuts
alias claude='claude-code'
alias cc='claude-code'
alias claude-here='claude-code .'

# Claude Code project shortcuts
alias cc-new='claude-code --new'
alias cc-resume='claude-code --resume'
alias cc-help='claude-code --help'

# MCP server management
alias mcp-list='claude-code mcp list'
alias mcp-install='claude-code mcp install'
alias mcp-update='claude-code mcp update'

# Claude Code configuration helpers
claude-config() {
  if [ -f ~/.config/claude-desktop/config.json ]; then
    echo "Opening Claude Desktop config..."
    code ~/.config/claude-desktop/config.json
  else
    echo "Claude Desktop config not found at ~/.config/claude-desktop/config.json"
  fi
}

claude-logs() {
  if [ -d ~/Library/Logs/Claude ]; then
    echo "Opening Claude logs directory..."
    open ~/Library/Logs/Claude
  else
    echo "Claude logs directory not found"
  fi
}

# Project README and CLAUDE.md helpers
claude-readme() {
  if [ -f ./CLAUDE.md ]; then
    echo "CLAUDE.md exists in current directory"
    cat ./CLAUDE.md
  else
    echo "No CLAUDE.md found in current directory"
    echo "Would you like to create one? (y/n)"
    read -r response
    if [[ $response =~ ^[Yy]$ ]]; then
      cp ~/.dotfiles/CLAUDE.md ./CLAUDE.md
      echo "CLAUDE.md template copied to current directory"
    fi
  fi
}

# Quick Claude Code invocation with context
cc-with-context() {
  if [ -f ./CLAUDE.md ]; then
    echo "Found CLAUDE.md - Claude will have project context"
  fi
  
  if [ -f ./README.md ]; then
    echo "Found README.md - Claude will understand the project"
  fi
  
  claude-code .
}