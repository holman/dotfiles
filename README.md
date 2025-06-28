# My Dotfiles

Personal macOS development environment configuration based on [Holman's dotfiles](https://github.com/holman/dotfiles) philosophy.

## Quick Setup (New Machine)

```sh
git clone https://github.com/mikeywills/dotfiles.git ~/.dotfiles
cd ~/.dotfiles
script/bootstrap  # Sets up symlinks and git config
script/install    # Runs all installers (Homebrew, etc.)
```

## What's Included

- **Shell**: ZSH with custom prompt and completions
- **Package Managers**: Homebrew, Bun, Yarn
- **Version Managers**: pyenv (Python), asdf (Node.js)
- **Database**: PostgreSQL 11
- **Editor**: VS Code (default), Vim config
- **Git**: Custom aliases and commands
- **Automation**: GitHub Actions for Claude PR assistant

## Philosophy

Topic-centric organization - each directory represents a specific area (git, zsh, docker, etc.) rather than having monolithic config files.

## How It Works

### File Conventions

- **bin/**: Scripts added to `$PATH`
- **topic/\*.zsh**: Automatically loaded shell configuration
- **topic/path.zsh**: PATH modifications (loaded first)
- **topic/completion.zsh**: Shell completions (loaded last)
- **topic/install.sh**: Topic-specific installers
- **topic/\*.symlink**: Files symlinked to `$HOME` (e.g., `gitconfig.symlink` → `~/.gitconfig`)

### Key Commands

```sh
bin/dot        # Update macOS defaults, Homebrew, and run installers
bin/dot -e     # Open dotfiles in VS Code
```

### Secrets Management

- Private environment variables go in `~/.localrc` (not tracked)
- Git user config goes in `~/.gitconfig.local` (not tracked)

## Adding New Topics

1. Create a directory for your topic (e.g., `rust/`)
2. Add configuration files following the conventions above
3. Run `script/bootstrap` if you added symlinks
4. Run `script/install` if you added an installer

## Maintenance

```sh
# Keep everything updated
bin/dot

# After making changes to symlinks
script/bootstrap

# Check what's installed
brew list
brew list --cask
```

## Current Tools & Versions

- **Homebrew packages**: Run `brew list` to see all
- **Python**: Managed by pyenv
- **Node.js**: Managed by asdf
- **PostgreSQL**: Version 11 (path: `/opt/homebrew/opt/postgresql@11/bin`)

## AI Integration

- **CLAUDE.md**: Provides context for Claude Code when working in this repository
- **GitHub Actions**: Claude PR assistant (triggered by @claude mentions)

## Credits

Originally inspired by [Holman's dotfiles](https://github.com/holman/dotfiles) and [Ryan Bates' dotfiles](https://github.com/ryanb/dotfiles).
