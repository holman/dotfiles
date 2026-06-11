#!/usr/bin/env bash
#
# install.sh — one-shot bootstrap for a fresh Mac.
#
# Installs Homebrew + everything in the Brewfile, sets up Oh My Zsh and
# Powerlevel10k, symlinks the *.symlink dotfiles into $HOME, and prints the
# manual steps that can't be scripted (iTerm2 font, `p10k configure`).
#
# Safe to re-run: every step checks before acting. This is a thin, explicit
# alternative to the holman-native `script/bootstrap`.

set -euo pipefail

DOTFILES_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"

info()    { printf '\033[00;34m==>\033[0m %s\n' "$1"; }
success() { printf '\033[00;32m ok\033[0m %s\n' "$1"; }
warn()    { printf '\033[00;33m !!\033[0m %s\n' "$1"; }

# 1. Homebrew ----------------------------------------------------------------
if ! command -v brew >/dev/null 2>&1; then
  info "Installing Homebrew"
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
  # Put brew on PATH for the rest of this script (Apple Silicon vs Intel).
  if [[ -x /opt/homebrew/bin/brew ]]; then
    eval "$(/opt/homebrew/bin/brew shellenv)"
  elif [[ -x /usr/local/bin/brew ]]; then
    eval "$(/usr/local/bin/brew shellenv)"
  fi
else
  success "Homebrew already installed"
fi

# 2. Tools (Brewfile) --------------------------------------------------------
# Installs: iterm2, tmux, fzf, eza, bat, ripgrep, zoxide, lazygit, gh,
# powerlevel10k, font-meslo-lg-nerd-font, visual-studio-code, ... (see Brewfile)
info "Installing tools from Brewfile"
brew bundle --file="$DOTFILES_ROOT/Brewfile"
success "Brewfile complete"

# 3. Oh My Zsh ---------------------------------------------------------------
# RUNZSH=no  -> don't drop us into a new shell mid-install.
# KEEP_ZSHRC=yes -> don't overwrite the .zshrc we're about to symlink.
if [[ ! -d "$HOME/.oh-my-zsh" ]]; then
  info "Installing Oh My Zsh"
  RUNZSH=no KEEP_ZSHRC=yes \
    sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
else
  success "Oh My Zsh already installed"
fi

# 4. Powerlevel10k (as an Oh My Zsh custom theme) ----------------------------
P10K_DIR="${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k"
if [[ ! -d "$P10K_DIR" ]]; then
  info "Installing Powerlevel10k theme"
  git clone --depth=1 https://github.com/romkatv/powerlevel10k.git "$P10K_DIR"
else
  success "Powerlevel10k already installed"
fi

# 5. Symlink dotfiles --------------------------------------------------------
# Mirrors script/bootstrap: every  <topic>/<name>.symlink  ->  ~/.<name>
info "Symlinking *.symlink files into \$HOME"
while IFS= read -r src; do
  dst="$HOME/.$(basename "${src%.*}")"
  if [[ -L "$dst" && "$(readlink "$dst")" == "$src" ]]; then
    success "already linked: $dst"
  elif [[ -e "$dst" || -L "$dst" ]]; then
    mv "$dst" "$dst.backup"
    ln -s "$src" "$dst"
    warn "backed up $dst -> $dst.backup, linked fresh"
  else
    ln -s "$src" "$dst"
    success "linked $dst"
  fi
done < <(find "$DOTFILES_ROOT" -maxdepth 2 -name '*.symlink' -not -path '*/.git/*')

# 6. git identity (private, never committed) ---------------------------------
if [[ ! -f "$HOME/.gitconfig.local" ]]; then
  warn "No ~/.gitconfig.local found. Create it so commits are attributed:"
  cat <<'EOF'

    cat > ~/.gitconfig.local <<'LOCAL'
    [user]
            name = Your Name
            email = you@example.com
    [credential]
            helper = osxkeychain
    LOCAL
EOF
fi

# Next steps -----------------------------------------------------------------
cat <<'EOF'

Done. Manual steps that can't be scripted:

  1. iTerm2 -> Settings -> Profiles -> Text -> Font -> "MesloLGS NF"
     (the font ships via the Brewfile cask 'font-meslo-lg-nerd-font').
  2. Restart your terminal, then style the prompt:   p10k configure
  3. Authenticate the GitHub CLI:                     gh auth login

EOF
