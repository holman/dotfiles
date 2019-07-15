# holman does dotfiles

Your dotfiles are how you personalize your system. These are mine.

If you're interested in the philosophy behind why projects like these are
awesome, you might want to [read a post on the
subject](http://zachholman.com/2010/08/dotfiles-are-meant-to-be-forked/).

## topical

Everything's built around topic areas. If you're adding a new area to your
forked dotfiles — say, "Java" — you can simply add a `java` directory and put
files in there. Anything with an extension of `.zsh` will get automatically
included into your shell. Anything with a prefix of `symlink` will get
symlinked without the prefix into `$HOME` when you run `script/bootstrap`.
Note this is differs from holman so that the extension remains unchanged which
helps with syntax highlighting. Additionally, + signs in the name are used
to indicate directories.

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
- **topic/symlink**: Any file starting with `symlink` gets symlinked into
  your `$HOME`. This is so you can keep all of those versioned in your dotfiles
  but still keep those autoloaded files in your home directory.
  * To further nest symlinks into subdirectories under `$HOME`, use `+` signs
  to signify additional directory delimiters. So for example, the file
  `topic/symlink.folder_name+file_name`
  would get symlinked to `$HOME/.folder_name/file_name` when you run `script/bootstrap`.

## install

Run this:

```sh
git clone https://github.com/r-richmond/dotfiles.git ~/.dotfiles
cd ~/.dotfiles
script/bootstrap
```

This will symlink the appropriate files in `.dotfiles` to your home directory.
Everything is configured and tweaked within `~/.dotfiles`.

The main file you'll want to change right off the bat is `zsh/symlink.zshrc`,
which sets up a few paths that'll be different on your particular machine.

`dot` is a simple script that installs some dependencies, sets sane macOS
defaults, and so on. Tweak this script, and occasionally run `dot` from
time to time to keep your environment fresh and up-to-date. You can find
this script in `bin/`.

## bugs

I want this to work for everyone; that means when you clone it down it should
work for you even though you may not have `something` installed, for example. That
said, I do use this as _my_ dotfiles, so there's a good chance I may break
something if I forget to make a check for a dependency.

If you're brand-new to the project and run into any blockers, please
[open an issue](https://github.com/r-richmond/dotfiles/issues) on this repository
and I'd love to get it fixed for you!

## thanks

I forked [Holman's](http://github.com/holman)' excellent
[dotfiles](http://github.com/holman/dotfiles) Most of the code in these dotfiles
stem or are inspired from Holman's original project.

## Python troubles post updates
* Fix Hydrogen
  * `python3 -m jupyter kernelspec remove python3`
  * `python3 -m ipykernel install`
* Fix Virtual envs
  * `pipenv --rm`
  * `pipenv sync`

## things left to do
* updated keyboard shortcuts
  * change caps to esc-key - system preferences > keyboard > modifier keys
  * add notification to option-` - system preferences > keyboard > shortcuts > mission control
  * change keyboard ctrl-option-cmd-space - system preferences > keyboard > shortcuts > input sources
* replace siri button with lock button on touchbar
  * system preferences > keyboard > customize control strip
* turnoff mission control key settings for ctrl-up/down
  * system preferences > mission control > mission control, application windows
* add mouse settings for buttons 4, 5, 3
  * system preferences > mission control >
* configure alfred powerpack
  * setup powerpack & link to sync folder & setup theme
* Figure out how to safe misc system preferences
  * keyboard shortcuts defined via macos
