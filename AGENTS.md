# AGENTS.md - Dotfiles Repository Guide

## Build/Test Commands
- `./script/bootstrap` - Install dotfiles and dependencies
- `./script/install` - Run all installers and brew bundle
- `brew bundle` - Install Homebrew packages from Brewfile
- `./bin/dot` - Update dotfiles and run maintenance

## Code Style Guidelines

### Shell Scripts (Zsh/Bash)
- Use `#!/usr/bin/env bash` or `#!/usr/bin/env zsh` shebangs
- Follow existing function naming: `setup_gitconfig()`, `link_file()`, `install_dotfiles()`
- Use `set -e` for error handling in scripts
- Indent with 2 spaces (existing convention)
- Use descriptive variable names in UPPER_SNAKE_CASE for exports, lower_case for locals

### Configuration Files
- Use `.symlink` extension for files that should be linked to home directory
- Keep local overrides in `.local` files (e.g., `gitconfig.local.symlink`)
- Use logical grouping in configs (aliases, exports, settings)

### Git Configuration
- Enforce SSH over HTTPS for GitHub/GitLab/Bitbucket
- Use `master` as default branch
- Enable GPG signing for commits
- Custom aliases in gitconfig.symlink: `co`, `promote`, `wtf`, `rank-contributors`

### File Organization
- Group related configs in subdirectories (zsh/, git/, vim/, etc.)
- Install scripts should be named `install.sh`
- Custom binaries go in `bin/` directory
- Use descriptive names for custom scripts

### Testing & Validation
- No formal test suite - validate by running installation scripts
- Test changes in a clean environment before committing
- Verify symlinks are created correctly after bootstrap