# Andy does dotfiles

My collection of dotfiles. An attempt to keep my settings in a single place
so that it's easier to move between my work and home macOS machines.

## components

- **bin/**: A collection of executables that I came across (or wrote!) one day.
- **topic/\*.symlink**: Any file ending in `*.symlink` gets symlinked into
  your `$HOME`. This is so you can keep all of those versioned in your dotfiles
  but still keep those autoloaded files in your home directory. These get
  symlinked in when you run `script/bootstrap`.
- **script/install**: Run this to install essentials for this setup
- **script/bootstrap**: Run this to set symlinks and made some basic configuration like
settings macOS defaults.
- **zsh/**: My `.zshrc` file split into a handful of files (like `aliases.zsh` or `exports.zsh`).
My setup includes [oh-my-zsh](https://github.com/ohmyzsh/ohmyzsh) with [powerlevel10k](https://github.com/romkatv/powerlevel10k) theme

## install

Run this:

```sh
git clone https://github.com/qstrnd/dotfiles.git ~/.dotfiles && \
cd ~/.dotfiles && \
script/install && \
script/bootstrap
```

This will symlink the appropriate files in `.dotfiles` to your home directory.
Everything is configured and tweaked within `~/.dotfiles`.

## thanks

Initially based on [Zach Holman's](https://github.com/holman/) dotfiles.
But I soon realized his system is too complex for my needs and tried to simplify
the setup (at least for a start).

If you're interested, read Zach's [post]((http://zachholman.com/2010/08/dotfiles-are-meant-to-be-forked/)) on organizing dotfiles and check his [dotfiles](https://github.com/holman/dotfiles)!
