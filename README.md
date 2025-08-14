# Modern Development Dotfiles

A modernized dotfiles setup optimized for Go, TypeScript, Python development with full DevOps tooling support. Built on the foundation of [Zach Holman's dotfiles](https://github.com/holman/dotfiles) but updated for current development workflows.

## 🚀 Quick Start

### Fresh MacBook Setup

```bash
# Clone the dotfiles
git clone https://github.com/ccnixon/dotfiles ~/.dotfiles

# Navigate to the dotfiles directory
cd ~/.dotfiles

# Run the bootstrap script
script/bootstrap
```

The bootstrap script will:
- Set up Git configuration (prompts for your name/email)
- Create symlinks for all configuration files
- Install Homebrew and all development tools
- Configure your shell environment

### After Installation

1. **Restart your terminal** to load the new configuration
2. **Install latest Node.js**: `fnm install --lts && fnm use lts`
3. **Set up Python**: `uv python install 3.12 && uv python pin 3.12`
4. **Configure Git**: The bootstrap script will prompt for your Git credentials
5. **Optional**: Run `dot` periodically to keep everything updated

## 🛠 What's Included

### Development Languages & Tools
- **Go**: Full environment with GOPATH configured for `~/Code` structure
- **Node.js**: fnm for fast version management, comprehensive npm/yarn aliases  
- **Python**: uv for modern package management and virtual environments
- **Rust**: rustup for when you need it

### Web Development & Frontend
- **Next.js**: Complete development workflow with optimization helpers
- **Turborepo**: Monorepo management with workspace shortcuts
- **Vercel**: Deployment and preview management
- **PlanetScale**: Database branch management and connection helpers
- **Modern tooling**: Vite, Remix, Astro, Tailwind CSS

### DevOps & Cloud Tools
- **Kubernetes**: kubectl, kubectx/kubens, k9s, helm, stern, kustomize
- **Terraform**: Full IaC stack with terragrunt, tflint, tfsec, infracost
- **Docker**: Complete container workflow with cleanup utilities
- **Cloud CLIs**: AWS, Azure, GCP with security tools like aws-vault

### Shell & Terminal
- **Starship**: Fast, customizable prompt with Git and language info
- **Modern CLI tools**: bat, eza, ripgrep, fd, fzf, zoxide
- **Enhanced history**: atuin for better shell history management
- **Auto-completion**: zsh-autosuggestions and syntax highlighting

### Development Apps
- **Editors**: VS Code, Cursor (AI-powered), Neovim
- **Productivity**: Raycast, Rectangle, Arc browser
- **Database**: TablePlus for GUI database management
- **API**: Postman for API development

## 📂 Project Structure

This setup follows a **topic-centric** approach where each development area has its own directory:

### Special Files
- **`bin/`**: Scripts added to your `$PATH`
- **`topic/*.zsh`**: Auto-loaded shell configuration  
- **`topic/path.zsh`**: PATH setup (loaded first)
- **`topic/completion.zsh`**: Auto-completion (loaded last)
- **`topic/install.sh`**: Executed during installation
- **`topic/*.symlink`**: Files symlinked to `$HOME`

### Key Directories
- **`aws/`**: AWS CLI shortcuts and configuration
- **`docker/`**: Docker and container aliases
- **`git/`**: Git configuration and custom commands
- **`go/`**: Go development environment
- **`kubernetes/`**: k8s tools and shortcuts
- **`nextjs/`**: Next.js development shortcuts and helpers
- **`node/`**: Node.js and TypeScript setup  
- **`planetscale/`**: Database management and branching
- **`python/`**: Python and uv configuration
- **`terraform/`**: Infrastructure as Code tools
- **`turborepo/`**: Monorepo management and workspace tools
- **`vercel/`**: Deployment and hosting shortcuts
- **`webdev/`**: Modern web development utilities
- **`zsh/`**: Modern shell configuration

## 🔧 Customization

### Adding New Tools
1. Create a new directory: `mkdir mynewtools`
2. Add configuration: `echo "alias mt='mynewtools'" > mynewtools/aliases.zsh`
3. Add to PATH: `echo 'export PATH="$PATH:/usr/local/mynewtools"' > mynewtools/path.zsh`
4. Reload shell: `source ~/.zshrc`

### Local Overrides
- **`~/.localrc`**: For environment variables and sensitive data
- **Git local config**: `git/gitconfig.local.symlink` (auto-generated)
- Any file ending in `.local` is ignored by git

## 🔄 Maintenance

### Keep Everything Updated
```bash
dot  # Runs the maintenance script
```

The `dot` command will:
- Pull latest dotfiles changes
- Update Homebrew and all packages
- Run any new installation scripts
- Optionally update macOS system defaults

### Manual Updates
```bash
# Update specific tools
brew upgrade
fnm install --lts
uv self update

# Update shell completions
kubectl completion zsh > ~/.oh-my-zsh/completions/_kubectl
```

## 🎯 Development Workflow

### Quick Navigation
```bash
# Navigate to any GitHub repo quickly
goto username/repo-name  # Auto-clones if not present

# Jump to project directories  
c <project-name><TAB>  # Tab completion available
```

### Language-Specific Shortcuts
```bash
# Go development
gt          # go test
gb          # go build  
gm          # go mod tidy

# Node.js development
nr start    # npm run start
yt          # yarn test
node-list   # fnm list

# Python development
uv-run      # uv run
venv-create # uv venv
py          # python (via uv)

# Kubernetes
k get pods  # kubectl get pods
kctx        # kubectx (switch contexts)
k9          # k9s (cluster browser)

# Terraform  
tf plan     # terraform plan
tg apply    # terragrunt apply

# Web Development
ndev        # npm run dev (Next.js)
vdeploy     # vercel --prod with git commit
tbuild      # turbo build
psconnect   # pscale connect with defaults
```

## 🐛 Troubleshooting

### Common Issues

**Shell not loading properly**: Restart terminal or run `source ~/.zshrc`

**Command not found**: Make sure Homebrew installed correctly:
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

**Git configuration missing**: Re-run `script/bootstrap` to set up Git credentials

**PATH issues**: Check that `~/.zshrc` is being sourced and contains the proper PATH exports

### Getting Help
- Check existing issues in this repository
- Review the logs from `script/bootstrap` for any errors
- Verify Homebrew bundle installed correctly: `brew bundle check --file=Brewfile`

## 📝 License

This project maintains the same MIT license as the original Holman dotfiles.

## 🙏 Acknowledgments

Built on the excellent foundation of [Zach Holman's dotfiles](https://github.com/holman/dotfiles). The topic-centric organization and installation scripts are based on his work, updated for modern development workflows.