# dotfiles

My macOS terminal setup — zsh, Oh My Zsh, Powerlevel10k, git, tmux, and a
CLI toolchain — built on [holman's topic-based dotfiles framework](https://github.com/holman/dotfiles).

**Why it exists:** one versioned source of truth for a new Mac. Clone, run one
script, and the shell, prompt, git config, editor wiring, and every CLI tool
come up the same way every time. Config is split by *topic* instead of one
sprawling `.zshrc`, so each tool's setup lives next to its name.

## How the framework works

The loader (`zsh/zshrc.symlink`, symlinked to `~/.zshrc`) auto-sources files by
convention — you rarely edit `~/.zshrc` itself:

| Pattern | Behavior |
|---|---|
| `<topic>/*.zsh` | sourced into every shell |
| `<topic>/path.zsh` | sourced **first** (sets up `$PATH`) |
| `<topic>/completion.zsh` | sourced **last** (after `compinit`) |
| `<topic>/*.symlink` | symlinked into `$HOME` minus the extension (e.g. `git/gitconfig.symlink` → `~/.gitconfig`) |
| `functions/*` | autoloaded zsh functions |
| `bin/*` | added to `$PATH` |

`$ZSH` points at the framework root (`~/.dotfiles`) and is referenced across
topic files and `~/.gitconfig`. Oh My Zsh wants that same variable for its own
install dir, so `~/.zshrc` lends `$ZSH` to OMZ only while sourcing it, then
restores it (see [Troubleshooting](#troubleshooting)).

---

## New Mac setup (in order)

```sh
# 1. Xcode command line tools (provides git, required to clone).
xcode-select --install

# 2. Clone to ~/.dotfiles — the framework expects this exact path ($ZSH).
git clone <this-repo-url> ~/.dotfiles
cd ~/.dotfiles

# 3. Bootstrap: Homebrew + Brewfile tools + Oh My Zsh + Powerlevel10k,
#    then symlink every *.symlink into $HOME.
./install.sh
```

Then the three manual steps `install.sh` prints (they can't be scripted):

4. **Set the font in iTerm2** → Settings → Profiles → Text → Font → **MesloLGS NF**.
5. **Style the prompt:** restart the terminal, then run `p10k configure`.
6. **Auth GitHub CLI:** `gh auth login`.
7. **Git identity:** create `~/.gitconfig.local` with your name/email (see [git](#git) below).

> The holman-native `script/bootstrap` still works and additionally prompts for
> your git identity and applies macOS defaults via `bin/dot`. `install.sh` is the
> explicit, OMZ/p10k-aware path.

---

## Tools configured

| Tool | Where it's wired | Notes |
|---|---|---|
| **iTerm2** | `Brewfile` (`cask 'iterm2'`) | terminal emulator; font set manually (below) |
| **tmux** | `tmux/tmux.conf.symlink` → `~/.tmux.conf` | mouse on, `\|`/`-` splits, vim pane nav |
| **zsh** | `zsh/*.zsh`, `zsh/zshrc.symlink` | history/keybindings in `zsh/config.zsh` |
| **Oh My Zsh** | `~/.zshrc` Oh My Zsh block | `plugins=(git)`, theme = Powerlevel10k |
| **Powerlevel10k** | `ZSH_THEME` + `zsh/prompt.zsh` fallback | prompt; config in `~/.p10k.zsh` |
| **lazygit** | `lazygit/aliases.zsh` | `lg` |
| **fzf** | `fzf/env.zsh` | `CTRL-R`/`CTRL-T`/`ALT-C`; rg-backed file search |
| **eza** | `eza/aliases.zsh` | `ls`/`ll`/`la`/`lt` |
| **bat** | `bat/aliases.zsh` | `cat` + man pager |
| **ripgrep** | `ripgrep/aliases.zsh` | `grep` → `rg` |
| **zoxide** | `zoxide/env.zsh` | `z`/`zi` |
| **gh CLI** | `Brewfile` (`brew 'gh'`) | GitHub CLI; `gh auth login` to set up |
| **VS Code CLI** | `editors/path.zsh` | adds `code` to `$PATH` from the app bundle |

Also present from the upstream framework: **atuin** (`atuin/env.zsh`, shell
history), **rbenv** (`ruby/rbenv.zsh`), **hub** (used by git aliases if
installed), **grc** (`system/grc.zsh`, colorized output), and the `zed` editor
(`editors/env.zsh` sets `$EDITOR`).

Every tool's topic file is guarded with `command -v`, so a missing tool never
breaks shell startup — you just don't get its alias.

---

## Aliases

**git** (`git/aliases.zsh`)

| Alias | Expands to | Purpose |
|---|---|---|
| `gl` | `git pull --prune` | pull and drop deleted remote branches |
| `gp` | `git push origin HEAD` | push current branch |
| `gco` | `git checkout` | |
| `gb` | `git branch` | |
| `gs` | `git status -sb` | short status + branch line |
| `gst` | `git status` | full status |
| `gc` | `git commit` | |
| `gca` | `git commit -a` | commit all tracked changes |
| `gac` | `git add -A && git commit -m` | stage everything + commit with message |
| `gd` | `git diff` piped through `sed`/`less` | diff with `+`/`-` markers stripped, color kept |
| `glog` | `git log --graph --pretty=…` | compact colored graph log |
| `gcb` | `git copy-branch-name` | copy current branch name to clipboard |
| `ge` | `git-edit-new` | open new/untracked files in `$EDITOR` |
| `git` | `hub` | only if `hub` is installed |

**files / search** (eza, bat, ripgrep — each only when the tool is installed)

| Alias | Expands to |
|---|---|
| `ls` | `eza --group-directories-first --icons=auto` |
| `ll` | `eza -lah --group-directories-first --icons=auto --git` |
| `la` | `eza -a --group-directories-first --icons=auto` |
| `lt` | `eza --tree --level=2 …` |
| `cat` | `bat` |
| `grep` | `rg` |

> When `eza` isn't installed, `system/aliases.zsh` falls back to GNU `gls` for
> `ls`/`l`/`ll`/`la` (requires `brew install coreutils`).

**other topics**

| Alias | Expands to | Topic |
|---|---|---|
| `lg` | `lazygit` | `lazygit/` |
| `d` / `d-c` | `docker` / `docker-compose` | `docker/` |
| `sc` / `sg` / `sd` | `script/console` / `generate` / `destroy` | `ruby/` |
| `ios` | `open -a Simulator` | `xcode/` |
| `pubkey` | copy `~/.ssh/id_rsa.pub` to clipboard | `system/keys.zsh` |
| `reload!` | `. ~/.zshrc` | `system/` |
| `cls` | `clear` | `system/` |

---

## Custom functions

Autoloaded from `functions/` (call them like any command):

- **`gchk`** — fuzzy branch picker. Lists local + remote branches (most recent
  first) in `fzf` with a log preview, and checks out your pick (a remote
  `origin/foo` checks out as tracking branch `foo`). Requires `fzf`.
  ```sh
  gchk
  ```
- **`gf <branch>`** — create and check out a local branch tracking
  `origin/<branch>`.
  ```sh
  gf feature-x
  ```
- **`c <project>`** — jump into a project under `$PROJECTS` (`~/Code`).
  Tab-completes project names.
  ```sh
  c my-app
  ```
- **`extract <file>`** — unpack any archive (`.tar.gz`, `.zip`, `.bz2`, …) or
  mount a `.dmg` with one command.
  ```sh
  extract release.tar.gz
  ```

### git subcommands (in `bin/`, run as `git <name>`)

`bin/` is on `$PATH`, so its `git-*` scripts work as native git subcommands:

| Command | Does |
|---|---|
| `git amend` | reuse the last commit message and amend |
| `git undo` | undo the last commit, keep the changes |
| `git up` / `git reup` | pull (or rebase) and show a short log of what changed |
| `git nuke <branch>` | delete a branch locally **and** on `origin` |
| `git track` | track `origin/<current-branch>` |
| `git credit <name> <email>` | re-attribute the latest commit |
| `git delete-local-merged` | delete local branches already merged into HEAD |
| `git unpushed` | diff of everything not yet pushed |
| `git all` | stage all unstaged changes |
| `git promote`, `git wtf`, `git rank-contributors`, `git count` | wired as git aliases in `~/.gitconfig` |

Other handy `bin/` scripts: `e` (open dir in editor), `search <str>` (recursive
search), `todo <name>` (drop a task file on the Desktop), `yt <url>` (download a
page's video via yt-dlp), `gitio <url>` (shorten a GitHub URL).

---

## git

Config lives in `git/gitconfig.symlink` → `~/.gitconfig`. Private bits (your
name, email, credentials) live in `~/.gitconfig.local`, which is `[include]`d
and **never committed**.

| Setting | Why |
|---|---|
| `core.editor = code --wait` | commit/rebase messages open in VS Code; `--wait` blocks git until you close the tab |
| `pager.branch = false` | `git branch` prints inline instead of opening the pager (no `less`/vim takeover) |
| `pager.diff = false` | same for `git diff` — output goes straight to the terminal |
| `core.excludesfile = ~/.gitignore` | global ignore (`git/gitignore.symlink`: `.DS_Store`, `*~`, `*.swp`) |
| `pull.rebase = true` | rebase on pull instead of creating merge commits |
| `push.default = simple` | push only the current branch to its upstream |
| `init.defaultBranch = main` | new repos start on `main` |
| `credential.helper = osxkeychain` | store credentials in the macOS Keychain |
| `help.autocorrect = 1` | auto-run the corrected command after a typo |
| `color.* = auto/true` | colored diff/status/branch output |
| `diff "spaceman-diff"` | image-aware diffs via `spaceman-diff` |
| `[include] ~/.gitconfig.local` | keeps identity/secrets out of the public repo |

---

## Nerd Font (MesloLGS) & iTerm2

Powerlevel10k draws its arrows/icons with glyphs that only exist in a **Nerd
Font**. Without one you get `?`/boxes.

**Install the font** (any one of):

- It's in the Brewfile: `brew install --cask font-meslo-lg-nerd-font` (run by `install.sh`).
- Or let `p10k configure` offer to download it for you.
- Or grab the four `MesloLGS NF` `.ttf` files from the
  [Powerlevel10k fonts list](https://github.com/romkatv/powerlevel10k#meslo-nerd-font-patched-for-powerlevel10k)
  and install them via Font Book.

**Point iTerm2 at it:** Settings → Profiles → *(your profile)* → Text →
**Font** → **MesloLGS NF** (size ~13). Reopen iTerm2.

---

## Troubleshooting

**Icons show as `?` or boxes.** The Nerd Font isn't selected in your terminal.
Install MesloLGS NF and set it as the iTerm2 profile font (see above). `echo
""` should render an Apple logo once it's working.

**`git branch` / `git diff` open vim or a pager.** Fixed by `pager.branch =
false` and `pager.diff = false` in `~/.gitconfig`. If it still happens, your
`~/.gitconfig` symlink is probably missing or stale — confirm with
`git config --get pager.branch` (should print `false`) and re-run `./install.sh`.

**`gco` (or `gp`, `glog`) isn't doing what Oh My Zsh's git plugin does.** That's
expected. The OMZ `git` plugin defines those aliases when it loads, but the
topic loader sources `git/aliases.zsh` *after* Oh My Zsh, so **this repo's
definitions win** (e.g. `gp` here is `git push origin HEAD`, not OMZ's `git
push`). Check what you actually have with `which gco`. To prefer OMZ's versions,
remove the line from `git/aliases.zsh`; to prefer the repo's (default), leave it.

**`fatal: not a git repository` on every new shell.** Something is running
`git` at shell-load time outside a repo. The prompt here is Powerlevel10k, which
handles non-repo directories cleanly, so the usual culprit is a custom snippet
in `~/.localrc` or an added topic. Guard it:
```sh
git rev-parse --is-inside-work-tree >/dev/null 2>&1 && <your git command>
```
(The old hand-rolled prompt used to do this in `precmd`; it's been replaced by
p10k.)

**`zsh: command not found` for `eza`/`bat`/`rg`/`code`/`gh` on a fresh
install.** The tool isn't installed yet, or Homebrew isn't on `PATH`. The topic
files guard with `command -v`, so the shell still starts — you just don't get
the alias. Fix: run `./install.sh` (or `brew bundle`), and make sure brew is on
PATH (`eval "$(/opt/homebrew/bin/brew shellenv)"`; `homebrew/path.zsh` adds
`/opt/homebrew/bin` for you in new shells).

> Known upstream quirk: `editors/windsurf.zsh` hardcodes a `/Users/holman/...`
> path. It's harmless (the directory won't exist on your machine) but edit it to
> your own path or delete the file if you don't use Windsurf.

---

## Adding a new topic

Make a folder, drop in a `*.zsh` file (auto-sourced) and/or a `*.symlink` file
(linked into `$HOME` on the next `./install.sh`). That's the whole API.

## Thanks

Built on [Zach Holman's dotfiles](https://github.com/holman/dotfiles), which in
turn drew from [Ryan Bates'](https://github.com/ryanb/dotfiles).
