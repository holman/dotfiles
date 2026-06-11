# SETUP — new Mac cheat sheet

One page to get running. Full detail lives in [README.md](README.md).

## TL;DR

```sh
xcode-select --install                       # git
git clone <this-repo-url> ~/.dotfiles && cd ~/.dotfiles
./install.sh                                 # brew + tools + OMZ + p10k + symlinks
```

Then: set iTerm2 font → `p10k configure` → `gh auth login`. Done.

---

## 1. Install everything (one shot)

If you'd rather not run `install.sh`, this reproduces it:

```sh
# Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
eval "$(/opt/homebrew/bin/brew shellenv)"

# CLI tools + apps + font, in one go
brew install fzf eza bat ripgrep zoxide lazygit gh tmux powerlevel10k
brew install --cask iterm2 font-meslo-lg-nerd-font visual-studio-code

# Oh My Zsh (won't clobber an existing ~/.zshrc)
RUNZSH=no KEEP_ZSHRC=yes sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

# Powerlevel10k as an Oh My Zsh custom theme
git clone --depth=1 https://github.com/romkatv/powerlevel10k.git \
  "${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k"
```

## 2. `.zshrc` aliases block (copy/paste)

Already wired via the topic framework. Paste this only if you want the aliases
standalone, without the repo:

```sh
# --- prompt / framework ---
ZSH_THEME="powerlevel10k/powerlevel10k"
plugins=(git)
source "$HOME/.oh-my-zsh/oh-my-zsh.sh"
[[ -f ~/.p10k.zsh ]] && source ~/.p10k.zsh

# --- tools ---
command -v fzf    >/dev/null && source <(fzf --zsh)
command -v zoxide >/dev/null && eval "$(zoxide init zsh)"   # adds: z, zi

# --- files / search (each only if the tool is installed) ---
command -v eza >/dev/null && {
  alias ls='eza --group-directories-first --icons=auto'
  alias ll='eza -lah --group-directories-first --icons=auto --git'
  alias la='eza -a --group-directories-first --icons=auto'
  alias lt='eza --tree --level=2 --group-directories-first --icons=auto'
}
command -v bat >/dev/null && alias cat='bat'
command -v rg  >/dev/null && alias grep='rg'
command -v lazygit >/dev/null && alias lg='lazygit'

# --- git ---
alias gl='git pull --prune'
alias gp='git push origin HEAD'
alias gco='git checkout'
alias gb='git branch'
alias gs='git status -sb'
alias gst='git status'
alias gc='git commit'
alias gca='git commit -a'
alias gac='git add -A && git commit -m'

# --- gchk: fuzzy branch picker (needs fzf) ---
gchk() {
  local b
  b=$(git branch --all --sort=-committerdate --format='%(refname:short)' \
      | grep -v '^origin/HEAD' \
      | fzf --no-multi --preview 'git log --oneline --graph --color=always -n 30 {}') || return
  [[ -z "$b" ]] && return
  [[ "$b" == origin/* ]] && git checkout "${b#origin/}" || git checkout "$b"
}
```

## 3. `.gitconfig` block (copy/paste)

```ini
[core]
        editor = code --wait
        excludesfile = ~/.gitignore
[pager]
        branch = false
        diff = false
[pull]
        rebase = true
[push]
        default = simple
[init]
        defaultBranch = main
[credential]
        helper = osxkeychain
[help]
        autocorrect = 1
[color]
        ui = true
# keep your name/email/secrets out of version control:
[include]
        path = ~/.gitconfig.local
```

And `~/.gitconfig.local` (private, not committed):

```ini
[user]
        name = Your Name
        email = you@example.com
```

## 4. iTerm2 checklist

- [ ] Settings → Profiles → Text → **Font = MesloLGS NF** (size ~13)
- [ ] Restart iTerm2 after changing the font
- [ ] Run `p10k configure` to style the prompt
- [ ] Glyph test: `echo "  "` shows an Apple logo + branch icon, not `?`

## 5. Verify it works

```sh
# Each should print a path, not "not found"
which fzf eza bat rg zoxide lazygit gh code tmux

# Tools respond
eza --version && bat --version && rg --version && zoxide --version

# Prompt + theme loaded
echo $ZSH_THEME                       # powerlevel10k/powerlevel10k
typeset -f p10k >/dev/null && echo "p10k loaded"

# git settings applied
git config --get core.editor          # code --wait
git config --get pager.branch         # false

# aliases live
which ls cat grep gco gst lg          # show the alias expansions
type gchk                             # gchk is a shell function

# gh authenticated
gh auth status
```
