# TODO list for Steve's dotfiles repo

## Dotfiles Tasks
- [x] Run /init to generate an AGENTS.md
- [x] Update the README.md
  - [x] Mention getting inspiration from:
    - https://github.com/Kainoa-h/MacSetup

## OpenCode Tasks
- [x] Create opencode/command/quality/test-plan.md command file
- [x] Create opencode/command/quality/write-tests.md command file
- [x] Create opencode/command/ops/optimize.md command file
- [x] Create opencode/README.md with an overview and getting started
- [x] Create opencode/AGENT_GUIDE.md with instructions for AI agents
- [x] Create opencode/agent/README.md with agent-specific details
- [x] Create opencode/command/README.md with command-specific details
- [x] Add any missing but necessary README.md files in opencode subdirectories
- [x] Add any missing but necessary agent instructions or overviews in opencode subdirectories

- [x] Add sketchybar to the Brewfile
- [x] Configure sketchybar to work with aerospace
- [x] Configure borders to work with aerospace
- [x] configure aerospace, sketchybar, and borders to launch on startup
- [x] hide the macos top bar
- [x] add neovim to the brewfile
- [x] configure neovim with lazyvim and dracula theme
- [x] replace mutt with neomutt in the Brewfile
- [x] Analyze the install script and report on optimizations that can be made. Save it in a md file at the root.
- [x] Think through the symlink configuration and how we can better use it to avoid copying files to other directories. I'd like to simply fetch the latest for this dotfiles repo and have all of my apps get the latest rather than needing to run the install again. Save this in another md report file, not making any changes yet.

## Implementation Tasks - Based on Analysis Reports

### Phase 1: Foundation and Idempotency
- [ ] Implement comprehensive logging in install scripts
- [ ] Add installation state tracking for idempotency
- [ ] Create backup and rollback mechanism for failed installations
- [ ] Add error handling with recovery instructions

### Phase 2: Unified Symlink Structure
- [ ] Create standardized config/ and home/ directory structure
- [ ] Convert existing .symlink files to new structure
- [ ] Move newsboat and thefuck configs to symlink structure
- [ ] Create default configurations for aerospace, fzf, yazi, bat, eza, ripgrep, zoxide
- [ ] Update script/bootstrap to handle unified symlink structure

### Phase 3: App Configuration Integration
- [ ] Convert ghostty install.sh to symlink-based configuration
- [ ] Convert zed install.sh to symlink-based configuration  
- [ ] Convert nvim install.sh to symlink-based configuration (keep LazyVim separate)
- [ ] Add configuration management for all Brewfile apps
- [ ] Remove individual install.sh scripts where possible

### Phase 4: Enhanced Update Workflow
- [ ] Modify bin/dot to implement git pull + brew update workflow
- [ ] Add configuration validation after updates
- [ ] Implement parallel installation for independent components
- [ ] Add dependency management between installers
- [ ] Create update verification and reporting

### Phase 5: Testing and Validation
- [ ] Test idempotency - running install multiple times safely
- [ ] Test update workflow - git pull updates all symlinked configs
- [ ] Test app updates - brew update keeps configurations intact
- [ ] Test rollback mechanism for failed installations
- [ ] Create documentation for new workflow
