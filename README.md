These fork from [holman does dotfiles](https://github.com/holman/dotfiles/fork).

# My Things

## emacs / spacemacs

### Github layer

* To get the Github layer working you need to set a Github Oauth Token:

```
git config --global github.oauth-token <token>
```

## Additional macOS setup

_There may be better ways to do this with plist magic_

* Updates keyboard shortcuts for moving between spaces to `CMD + H` and `CMD + L`

This can be found under `System Preferences` --> `Keyboard` --> `Shortcuts` --> `Mission Control`. The options are `Mission Contol / Move left a space` and `Mission Contol / Move right a space`. 

* Set up Nightshfit 

`System Preferences` --> `Displays` --> `Night Shift` 

* Change Caps Lock to Control

`System Preferences` --> `Keyboard` --> `Keyboard Tab` --> `Modifier Keys` button

* Install [SF fonts](https://medium.com/@deepak.gulati/using-sf-mono-in-emacs-6712c45b2a6d)

```bash
open /Applications/Utilities/Terminal.app/Contents/Resources/Fonts/
```

This should open up a Finder window showing a folder containing the SF fonts. Select all, right click, and open. This should let you add them to Font Book.

## Additional things to download

These are things that need to be installed downloaded that are not installed via the bootstrap script.

These are mostly to play nice with the [JS](http://spacemacs.org/layers/+lang/javascript/README.html), [TypeScript](http://spacemacs.org/layers/+lang/typescript/README.html), and [React](http://spacemacs.org/layers/+frameworks/react/README.html) layers in Spacemacs.

### Node Things

```
npm install -g tern js-beautify eslint babel-eslint eslint-plugin-react typescript-formatter javascript-typescript-langserver
```

### Alfred

Alfred will be install through homebrew.

To use instead of spotlight, you need to disable the spotlight keyboard shortcut:

`System Preferences` --> `Spotlight` --> `Keyboard Shortcuts` button 

You can then update the Alfred settings to `CMD + Space` 

### Third-party applications

* [Spectacles](https://www.spectacleapp.com)

### Style Prefernces

* Remove stuff from the dock
* Add the `HOME/Pictures/ScreenShots` direcotry to the dock


## asdf

### nodejs

```
bash /usr/local/opt/asdf/plugins/nodejs/bin/import-release-team-keyring
```

# Things from original project

## topical

Everything's built around topic areas. If you're adding a new area to your
forked dotfiles — say, "Java" — you can simply add a `java` directory and put
files in there. Anything with an extension of `.zsh` will get automatically
included into your shell. Anything with an extension of `.symlink` will get
symlinked without extension into `$HOME` when you run `script/bootstrap`.

## what's inside

A lot of stuff. Seriously, a lot of stuff. Check them out in the file browser
above and see what components may mesh up with you.
[Fork it](https://github.com/holman/dotfiles/fork), remove what you don't
use, and build on what you do use.

## components

There's a few special files in the hierarchy.

- **bin/**: Anything in `bin/` will get added to your `$PATH` and be made
  available everywhere.
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

Run this:

```sh
git clone https://github.com/tmr08c/dotfiles.git ~/.dotfiles
cd ~/.dotfiles
git submodule update --init
git submodule update --recursive --remote
script/bootstrap
```

This will symlink the appropriate files in `.dotfiles` to your home directory.
Everything is configured and tweaked within `~/.dotfiles`.

The main file you'll want to change right off the bat is `zsh/zshrc.symlink`,
which sets up a few paths that'll be different on your particular machine.

`dot` is a simple script that installs some dependencies, sets sane macOS
defaults, and so on. Tweak this script, and occasionally run `dot` from
time to time to keep your environment fresh and up-to-date. You can find
this script in `bin/`.

## bugs

I want this to work for everyone; that means when you clone it down it should
work for you even though you may not have `rbenv` installed, for example. That
said, I do use this as _my_ dotfiles, so there's a good chance I may break
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
