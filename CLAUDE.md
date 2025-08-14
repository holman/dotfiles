# Claude Code Configuration

This project uses various development tools and follows specific patterns. This file helps Claude Code understand the codebase structure and preferred workflows.

## Project Structure

This is a **topic-centric dotfiles repository** where each development area has its own directory:

- **`topic/*.zsh`**: Auto-loaded shell configuration
- **`topic/path.zsh`**: PATH setup (loaded first)  
- **`topic/completion.zsh`**: Auto-completion (loaded last)
- **`topic/install.sh`**: Installation scripts
- **`topic/*.symlink`**: Files symlinked to `$HOME`

## Development Environment

### Languages & Frameworks
- **Go**: Version managed via Homebrew, GOPATH set to `~/Code`
- **Node.js**: Version managed via fnm (Fast Node Manager)
- **Python**: Package management via uv (modern Python tooling)
- **TypeScript**: Integrated with Node.js toolchain
- **Next.js**: Full-stack React framework for web apps
- **Turborepo**: Monorepo management for multi-package projects

### Infrastructure & DevOps
- **Kubernetes**: Full k8s development with kubectl, k9s, helm
- **Terraform**: Infrastructure as Code with terragrunt, tflint, tfsec
- **Docker**: Container development and deployment
- **AWS/GCP/Azure**: Multi-cloud development support
- **Vercel**: Frontend deployment and hosting
- **PlanetScale**: Database management with branch workflows

### Shell & Terminal
- **Zsh** with **Starship** prompt (modern, fast prompt)
- Modern CLI tools: `eza`, `ripgrep`, `fd`, `bat`, `fzf`
- Enhanced history with `atuin`
- Directory jumping with `zoxide`

## Code Style & Conventions

### Shell Scripts
- Use `#!/usr/bin/env bash` or `#!/bin/sh` for portability
- Include descriptive function names and comments
- Follow existing alias patterns: short, memorable, intuitive
- Use proper error handling with `set -e` where appropriate

### Configuration Files
- YAML: 2-space indentation
- JSON: 2-space indentation  
- Shell: Follow existing indentation patterns
- Comments: Use `#` for shell, `//` for JSON when possible

### Naming Conventions
- **Aliases**: Short, memorable (e.g., `k` for `kubectl`, `tf` for `terraform`)
- **Functions**: Descriptive with hyphens (e.g., `docker-clean`, `next-info`)
- **Files**: Lowercase with hyphens for multi-word names
- **Directories**: Single words when possible, hyphens for compound terms

## Development Workflows

### Git Workflow
- Default branch: `main`
- SSH URLs preferred for GitHub repositories
- Delta pager for better diffs
- Custom hooks in `git/hooks/`

### Package Management
- **Homebrew**: Primary package manager for macOS
- **npm/yarn**: Node.js packages, prefer npm for new projects
- **uv**: Python package management and virtual environments
- **Go modules**: Enabled by default

### Testing Commands
When adding new functionality, common test commands to verify:
```bash
# Shell configuration
source ~/.zshrc

# Package installation  
brew bundle --file=Brewfile

# Git functionality
git status && git log --oneline -5

# Language environments
go version && node --version && python --version

# Tool availability
kubectl version --client && terraform version
```

## Common Patterns

### Adding New Tools
1. Add to `Brewfile` if it's a system tool
2. Create `toolname/config.zsh` for aliases and functions
3. Add `toolname/path.zsh` if PATH modification needed
4. Update README.md documentation
5. Test installation on clean environment

### Environment Variables
- Sensitive data goes in `~/.localrc` (gitignored)
- Tool configuration in respective `topic/path.zsh` files
- Export format: `export TOOL_VAR="value"`

### Error Handling
- Functions should validate required parameters
- Provide usage examples for complex functions
- Fail gracefully with helpful error messages
- Use `command -v tool &> /dev/null` to check tool availability

## Maintenance

### Update Process
Run `dot` command to:
- Pull latest dotfiles changes
- Update Homebrew and packages  
- Run installation scripts
- Optionally update macOS defaults

### Testing New Changes
- Test on separate branch first
- Verify symlinks are created correctly
- Check that new tools are accessible after shell reload
- Validate no existing functionality is broken

## Troubleshooting

### Common Issues
- **PATH problems**: Check `topic/path.zsh` files load order
- **Missing commands**: Verify Brewfile installation completed
- **Shell not loading**: Restart terminal or `source ~/.zshrc`
- **Symlink conflicts**: Use bootstrap script's backup/overwrite options

### Debug Commands
```bash
# Check PATH
echo $PATH | tr ':' '\n'

# List loaded functions
declare -f | grep -E '^[a-zA-Z_-]+ \(\)'

# Verify Homebrew packages
brew list

# Check zsh configuration loading
zsh -x ~/.zshrc
```

## Security Notes

- No secrets or API keys should be committed to this repository
- Use `~/.localrc` for sensitive environment variables
- `.gitignore` excludes common sensitive file patterns
- SSH keys and GPG configuration handled separately

## Contributing

When adding new functionality:
1. Follow existing patterns and conventions
2. Test thoroughly on clean environment
3. Update documentation (README.md and this file)
4. Ensure no sensitive data is committed
5. Use descriptive commit messages with examples