# Dotfiles Contribution Guide

Personal dotfiles forked from [Zach Holman's layout](https://github.com/holman/dotfiles). Topical directories group per-tool config; `script/bootstrap` symlinks things into `$HOME`; `zsh/zshrc.dotsymlink` auto-sources `*.zsh` files across the repo.

These dotfiles drive the shell you're currently running in, so edits have high blast radius. Read the rules below before making changes.

## Repo Layout

Topical directories at the root — one per tool/concern. Add a new top-level dir when introducing a new tool. A few sampled examples:

```
dotfiles/
  zsh/             # shell config — zshrc.dotsymlink + auto-sourced *.zsh files
    zshrc.dotsymlink     → ~/.zshrc
    aliases.zsh          # sourced via $DOT/**/*.zsh glob
    goto.zsh             # project navigation function
    completion.zsh       # sourced after compinit
  git/             # git config + aliases
    gitconfig.dotsymlink → ~/.gitconfig
    gitignore.dotsymlink → ~/.gitignore
    aliases.zsh
    functions.zsh
  claude/          # Claude Code config (mirrors ~/.claude/ layout)
    .claude/
      CLAUDE.md.symlink  → ~/.claude/CLAUDE.md (global agent instructions)
  terminator/      # terminal emulator — uses .config/ nesting for XDG path
    .config/terminator/config.symlink → ~/.config/terminator/config
  bin/             # scripts — NOT symlinked; add to PATH manually if needed
  script/
    bootstrap      # the installer — creates the symlinks
```

## File Suffix Conventions

| Suffix / name      | What bootstrap does                                                        | Example                                                           |
|--------------------|----------------------------------------------------------------------------|-------------------------------------------------------------------|
| `*.dotsymlink`     | Symlinks to `~/.<name>` (strips suffix, prepends `.`)                      | `git/gitconfig.dotsymlink` → `~/.gitconfig`                       |
| `*.symlink`        | Symlinks to `~/<name>` (strips suffix, no dot prefix)                      | `terminator/.config/terminator/config.symlink` → `~/.config/terminator/config` |
| `*.zsh`            | **Not** symlinked. Auto-sourced by zshrc via `$DOT/**/*.zsh`               | `git/aliases.zsh`, `zsh/goto.zsh`                                 |
| `completion.zsh`   | **Not** symlinked. Sourced *after* `compinit` (for `compdef` / completions) | `zsh/completion.zsh`                                              |
| Anything else      | Ignored by bootstrap. Read from repo path as needed.                        | `bin/e`, `README.markdown`                                        |

Path preservation: bootstrap strips the topical-dir prefix but keeps subdir nesting. So `<topic>/a/b/file.symlink` → `~/a/b/file`. That's how `.config/…` targets get encoded — not a special case.

## Where New Things Go

- **New tool's config** → new top-level topical dir (`<tool>/`).
- **Per-tool aliases** → `<tool>/aliases.zsh` (not `zsh/aliases.zsh`).
- **New completion / `compdef` call** → `completion.zsh` inside the relevant topical dir (runs after `compinit`).
- **Per-tool functions** → `<tool>/functions.zsh` (convention, see `git/functions.zsh`).
- **Machine-specific config or secrets** → `~/.localrc` (gitignored, sourced by zshrc). Never commit these here.
- **New `*.dotsymlink` / `*.symlink` file** → flag that bootstrap needs to be re-run.

## How Changes Take Effect

| Change                              | Effect in new shells | Effect in current shell                          |
|-------------------------------------|----------------------|--------------------------------------------------|
| Edit an existing `*symlink` file    | Immediate            | Immediate (symlink points at the file)           |
| Edit an existing `*.zsh` file       | Next shell           | Only after `source` or re-login                  |
| Add a **new** `*.zsh` file          | Next shell           | Not loaded                                       |
| Add a **new** `*symlink` file       | Needs bootstrap run  | Nothing until bootstrap runs                     |

The user re-sources manually when needed — don't prompt them to do it.

## Testing Changes

- **Syntax check** new or edited shell scripts: `zsh -n <file>`. Cheap, catches typos and stray chars.
- **Runtime check** in an isolated subshell: `zsh -i -c 'source <file>; <test>'`. Never test by sourcing into the current shell — a broken file kills the session.
- When debugging a loaded function, remember the loader is guarded (e.g. `goto.zsh` has `if ! fn_exists goto`), so re-sourcing is a no-op unless you `unfunction` first.

## Bootstrap Policy

`script/bootstrap` is **interactive** — for existing files it prompts skip/overwrite/backup. High-blast-radius if run blindly.

- Run only when a new `*.dotsymlink` / `*.symlink` file was added.
- **Always ask the user before running.** Never invoke unprompted, even when you "know" bootstrap is needed.
- Editing existing `*symlink` files does **not** need a bootstrap run — the symlink already points at your changes.

## Hard Rules

- **Never run `script/bootstrap` unprompted.** Ask first.
- **Never delete legacy-looking topical dirs** (`xbindkeys/`, `xscreensaver/`, `apt/`, etc.) without explicit instruction. They may still be in use on other machines.
- **Don't reorganize the topical-directory layout.** The bootstrap loop assumes `<topic>/...` paths; restructuring breaks symlinking.
- **Don't convert zsh-specific idioms to POSIX.** This is a zsh repo — `local x=$arr[1]` (1-indexed), `${(@s:/:)var}` splits, `${var:=default}` assignment expansions, etc. are all intentional.
- **Never commit secrets or machine-specific config.** Use `~/.localrc` (gitignored, sourced by zshrc) for anything that shouldn't be public.
