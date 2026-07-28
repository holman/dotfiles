# Bart does dotfiles from apuyou from holman

Your dotfiles are how you personalize your system. These are mine.

I was a little tired of having long alias files and everything strewn about
(which is extremely common on other dotfiles projects, too). That led to this
project being much more topic-centric. I realized I could split a lot of things
up into the main areas I used (Ruby, git, system libraries, and so on), so I
structured the project accordingly.

If you're interested in the philosophy behind why projects like these are
awesome, you might want to [read my post on the
subject](http://zachholman.com/2010/08/dotfiles-are-meant-to-be-forked/).

## topical

Everything's built around topic areas. If you're adding a new area to your
forked dotfiles — say, "Java" — you can simply add a `java` directory and put
files in there. Anything with an extension of `.zsh` will get automatically
included into your shell. Anything with an extension of `.symlink` will get
symlinked without extension into `$HOME` when you run `script/bootstrap`.

## what's inside

A lot of stuff. Seriously, a lot of stuff. Check them out in the file browser
above and see what components may mesh up with you.
[Fork it](https://github.com/arribbar/dotfiles/fork), remove what you don't
use, and build on what you do use.

## components

There's a few special files in the hierarchy.

- **bin/**: Anything in `bin/` will get added to your `$PATH` and be made
  available everywhere.
- **Brewfile**: This is a list of applications for [Homebrew Cask](http://caskroom.io) to install: things like Chrome and 1Password and Adium and stuff. Might want to edit this file before running any initial setup.
- **topic/\*.zsh**: Any files ending in `.zsh` get loaded into your
  environment.
- **topic/path.zsh**: Any file named `path.zsh` is loaded first and is
  expected to setup `$PATH` or similar.
- **topic/completion.zsh**: Any file named `completion.zsh` is loaded
  last and is expected to setup autocomplete.
- **topic/install.sh**: Any file named `install.sh` is executed when you run `script/install`. To avoid being loaded automatically, its extension is `.sh`, not `.zsh`.
- **topic/\*.symlink**: Any file ending in `*.symlink` gets symlinked into
  your `$HOME`. This is so you can keep all of those versioned in your dotfiles
  but still keep those autoloaded files in your home directory. These get
  symlinked in when you run `script/bootstrap`.

## install
Before installing, you need to have oh-my-zsh installed

Run this:

```sh
git clone https://github.com/arribbar/dotfiles.git ~/.dotfiles
cd ~/.dotfiles
script/bootstrap
```

This will symlink the appropriate files in `.dotfiles` to your home directory.
Everything is configured and tweaked within `~/.dotfiles`.

The main file you'll want to change right off the bat is `zsh/zshrc.symlink`,
which sets up a few paths that'll be different on your particular machine.

That file now reads `DOTFILES` and `ZSH` from your environment if they are
already set, so the repo is easier to move between machines without editing the
file itself.

`dot` is a simple script that installs some dependencies, sets sane macOS
defaults, and so on. Tweak this script, and occasionally run `dot` from
time to time to keep your environment fresh and up-to-date. You can find
this script in `bin/`.

## update flow

Use `dot` as the high-level refresh command when you want to reconcile your
machine with the repo:

```bash
dot
```

That will apply macOS defaults, make sure Homebrew exists, update Homebrew,
and run the Homebrew bundle plus the topic installers.

For day-to-day maintenance, the split is usually:

```bash
brew update
brew bundle install --file=~/.dotfiles/Brewfile
brew upgrade
brew upgrade --cask
mas upgrade
sudo softwareupdate -ia
```

Use `brew upgrade --cask` for GUI apps you want Homebrew to keep aligned,
and let self-updating apps such as Firefox or Teams update themselves when
they ship their own updater. In that case Homebrew is still useful to install
and recover the app, but it is not always the source of truth for the exact
runtime version.

## Brewfile
To install or upgrade apps and utilities from the Brewfile:
```bash
brew bundle install --file=~/.dotfiles/Brewfile
```

Upgrade everything managed by Homebrew:
```bash
brew cu
```

You can also use [mas](https://github.com/mas-cli/mas) for App Store apps.

Homebrew formulae and casks are maintained upstream continuously. In practice,
that means you should expect new versions to appear regularly, but only after
your local Homebrew metadata has been refreshed with `brew update` or through
Homebrew's automatic update mechanism.

For self-updating casks, Homebrew may intentionally skip or defer the upgrade
if the app already updated itself. That is normal and avoids accidental
downgrades.

Some more tips on this [link](https://gist.github.com/ChristopherA/a579274536aab36ea9966f301ff14f3f)

## functions
To add a function like `c`, you need afterwards to run theses commands to have autocompletion:
```
compinit
rm .zcompdump*
```

## bugs

I want this to work for everyone; that means when you clone it down it should
work for you even though you may not have `rbenv` installed, for example. That
said, I do use this as *my* dotfiles, so there's a good chance I may break
something if I forget to make a check for a dependency.

If you're brand-new to the project and run into any blockers, please
[open an issue](https://github.com/holman/dotfiles/issues) on this repository
and I'd love to get it fixed for you!

## thanks

I forked [Ryan Bates](http://github.com/ryanb)' excellent
[dotfiles](http://github.com/ryanb/dotfiles) for a couple years before the
weight of my changes and tweaks inspired me to finally roll my own. But Ryan's
dotfiles were an easy way to get into bash customization, and then to jump ship
to zsh a bit later. A decent amount of the code in these dotfiles stem or are
inspired from Ryan's original project.
