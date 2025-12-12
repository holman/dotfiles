# steve does dotfiles

[dotfile setup](https://dotfiles.github.io) forked from [dan holman's dotfiles](https://github.com/holman/dotfiles). Be sure to read his [post](https://zachholman.com/2010/08/dotfiles-are-meant-to-be-forked) on the subject.

## Inspiration

This setup draws inspiration from comprehensive macOS development environments like [Kainoa-h/MacSetup](https://github.com/Kainoa-h/MacSetup), which showcases modern tooling configurations for enhanced productivity.

## Features

### OpenCode AI Development Toolkit
- **Specialized AI Agents**: Domain-specific agents for architecture, engineering, operations, and quality assurance
- **Smart Commands**: Task-specific commands that automatically route to appropriate specialists
- **Comprehensive Coverage**: From frontend development to security audits and performance optimization

### Development Tools
- **Shell Environment**: Zsh with Starship prompt and extensive aliases
- **Git Workflow**: Custom scripts for branch management, conflict resolution, and productivity
- **Editor Support**: Vim, Zed, and Ghostty configurations
- **Terminal Multiplexing**: Tmux setup with sensible defaults
- **Package Management**: Homebrew, Ruby (rbenv), Node (nvm), and Python environments

### macOS Optimization
- **System Settings**: Automated macOS defaults for better developer experience
- **Path Management**: Intelligent PATH configuration for all tools
- **Completion**: Comprehensive tab completion for shells and tools

## Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/.dotfiles.git ~/.dotfiles
cd ~/.dotfiles

# Run the bootstrap script
./script/bootstrap

# Install dependencies
./script/install
```

## Structure

```
.dotfiles/
├── opencode/          # AI development toolkit
├── bin/               # Custom scripts and utilities
├── zsh/               # Shell configuration
├── git/               # Git configuration and aliases
├── vim/               # Vim configuration
├── tmux/              # Tmux configuration
├── system/            # System-wide settings
└── script/            # Installation and setup scripts
```

## Custom Scripts

- `git-fuzzy-checkout` - Interactive branch selection
- `git-wtf` - Repository status overview
- `git-rank-contributors` - Contribution statistics
- `dns-flush` - Clear DNS cache
- `search` - Quick file search
- `todo` - Task management

## OpenCode Commands

Access specialized AI assistance with commands like:
- `/analyze` - Context-aware code analysis
- `/review` - Comprehensive code review
- `/plan` - Feature planning and architecture
- `/optimize` - Performance optimization
- `/security-audit` - Security vulnerability assessment

Each command routes to the appropriate specialist agent for expert guidance.
