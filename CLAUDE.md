# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a topic-centric dotfiles repository based on Holman's dotfiles philosophy. It manages macOS development environment configuration through modular "topics" - each directory represents a specific area of functionality (git, zsh, homebrew, etc.).

## Key Architecture Patterns

### Topic-Based Organization
- Each directory is a "topic" containing related configurations
- Topics can contain:
  - `*.symlink` files - symlinked to home directory (e.g., `git/gitconfig.symlink` → `~/.gitconfig`)
  - `*.zsh` files - automatically sourced by ZSH
  - `install.sh` - topic-specific installation script
  - `path.zsh` - PATH modifications (loaded first)
  - `completion.zsh` - completions (loaded last)

### File Loading Order
1. All `path.zsh` files (for PATH setup)
2. All other `*.zsh` files
3. All `completion.zsh` files (for autocomplete)

## Common Commands

### Setup & Installation
```bash
# Initial setup - creates symlinks and configures git
script/bootstrap

# Run all installers (Homebrew, macOS defaults, etc.)
script/install

# Update everything (macOS defaults, Homebrew, run installers)
bin/dot

# Edit dotfiles in VS Code
bin/dot -e
```

### Adding New Configurations
1. Create a new topic directory
2. Add `*.symlink` files for configs that go in home directory
3. Add `*.zsh` files for shell configurations
4. Add `install.sh` if the topic needs installation steps

## Important Files & Conventions

### Secrets Management
- Private environment variables go in `~/.localrc` (not tracked)
- Git user config goes in `~/.gitconfig.local` (not tracked)

### PATH Management
- PATH modifications go in `*/path.zsh` files
- The system automatically removes duplicates
- Local binaries: `$ZSH/bin` and `./bin` are added to PATH

### Git Configuration
- Global config: `git/gitconfig.symlink`
- Local/private config: `~/.gitconfig.local` (included by global)
- Custom git commands in `bin/` (git-promote, git-wtf, etc.)

## Development Notes

### When Adding Features
- Follow the topic-based structure
- Use `.symlink` extension for files that should be symlinked
- Place PATH modifications in `path.zsh` files
- Run `script/bootstrap` after adding new symlinks

### Testing Changes
- Source changes: `. ~/.zshrc`
- Or start a new shell session
- Run `bin/dot` to ensure everything installs correctly

### Current Stack
- Shell: ZSH with custom configuration
- Package Managers: Homebrew, Yarn, Bun
- Version Managers: pyenv (Python)
- Database: PostgreSQL 11
- Editor: Vim configuration included