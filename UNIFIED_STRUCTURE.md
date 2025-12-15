# Unified Configuration Structure

This directory contains the unified symlink structure for all dotfiles configurations.

## Directory Structure

### `home/`
Contains configuration files that should be symlinked to the home directory (`~/`).

```
home/
├── gitconfig.symlink          -> ~/.gitconfig
├── gitconfig.local.symlink     -> ~/.gitconfig.local  
├── gitignore.symlink          -> ~/.gitignore
├── zshrc.symlink            -> ~/.zshrc
├── tmux.conf.symlink        -> ~/.tmux.conf
├── vimrc.symlink           -> ~/.vimrc
├── muttrc.symlink          -> ~/.muttrc
├── gemrc.symlink           -> ~/.gemrc
└── irbrc.symlink          -> ~/.irbrc
```

### `config/`
Contains configuration files that should be symlinked to `~/.config/`.

```
config/
├── aerospace.symlink        -> ~/.config/aerospace
├── fzf.symlink            -> ~/.config/fzf
├── yazi.symlink           -> ~/.config/yazi
├── bat.symlink            -> ~/.config/bat
├── eza.symlink            -> ~/.config/eza
├── ripgrep.symlink        -> ~/.config/ripgrep
├── zoxide.symlink         -> ~/.config/zoxide
├── thefuck.symlink        -> ~/.config/thefuck/settings.py
├── newsboat.symlink       -> ~/.config/newsboat/config
└── newsboat_urls.symlink  -> ~/.config/newsboat/urls
```

## File Naming Convention

- All configuration files use the `.symlink` extension
- Files in `home/` are linked to `~/.filename` (removing `.symlink` and adding leading dot)
- Files in `config/` are linked to `~/.config/filename` (removing `.symlink`)
- Special cases like `newsboat_urls.symlink` are handled specifically in the bootstrap script

## Benefits

1. **Automatic Updates**: Changes to these files are immediately reflected when you update the repo
2. **Single Source of Truth**: All managed configurations are in one organized structure
3. **Easy Maintenance**: Clear separation between home directory and config directory files
4. **Idempotent Installation**: The bootstrap script can be run multiple times safely

## Migration

The unified structure replaces:
- Individual install scripts that copy files
- Scattered `.symlink` files throughout the repository
- Manual configuration management

## Special Handling

Some configurations require special setup:
- **Newsboat**: URLs file needs special handling to maintain correct filename
- **Shell Integration**: Tools like zoxide and fzf need shell integration in `.zshrc`
- **Dependencies**: Some configs require the corresponding apps to be installed

## Adding New Configurations

1. For home directory files: Add to `home/filename.symlink`
2. For config directory files: Add to `config/appname.symlink`
3. Update bootstrap script if special handling is needed
4. Test with `./script/bootstrap`