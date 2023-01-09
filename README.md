# dotfiles
Inspired by [holman's repo](https://github.com/holman/dotfiles) with extra input from [jldeen's repo](https://github.com/jldeen/dotfiles)

## Installation
```shell
cd ~
git clone https://github.com/miroag/.dotfiles.git
.dotfiles/bootstrap
```

This will symlink the appropriate files in `.dotfiles` to your home directory and run topic (see further) installers.
Everything is configured and tweaked within `~/.dotfiles`.

## Manual steps
### Fonts
Install Meslo Nerd fonts from `/fonts`. Credit to https://github.com/romkatv/powerlevel10k#meslo-nerd-font-patched-for-powerlevel10k

Configure your terminal to use this font
- __Tilix__: Open Tilix → Preferences and click on the selected profile under Profiles.
Check Custom font under Text Appearance and select `MesloLGS NF Regular`.
- __Windows Terminal__ by Microsoft (the new thing): Open Settings (Ctrl+,),
click either on the selected profile under Profiles or on Defaults, click Appearance and set Font face to `MesloLGS NF`.
- __IntelliJ__ (and other IDEs by Jet Brains): Open `File → Settings → Editor → Color Scheme → Console Font`.
Select Use console font instead of the default and set the font name to `MesloLGS NF`.
- __Chrome__ (for Azure Cloud Shell):  Navigate to [chrome://settings/fonts](chrome://settings/fonts)
and change Fixed-width font to the `MesloLGS NF`. (Update dd 2023-01-06 - it seems to be corrupted Cascadia Mono?)
- __Edge__ (for Azure Cloud Shell):  Navigate to [edge://settings/fonts](edge://settings/fonts)
and change Fixed-width font to the `MesloLGS NF`

For other systems see the link above

### Updates

The main file you'll want to change right off the bat is `zsh/zshrc.symlink`,
which sets up a few paths that'll be different on your particular machine. You also might want to configure `.tmux.conf` since I run a few scripts in the status bar.

`dot` is a simple script that can help in a separate topic installation. Usage: `dot topic-name`
It's sage to rerun `bootstrap` to refresh all installations

## What is installed ?
- ACS - Azure Cloud Shell
- WSL - Windows Subsystem for Linux

| Topic      | What                               | ACS | WSL | Description                                                    |
|:-----------|:-----------------------------------|:---:|:---:|:---------------------------------------------------------------|
| **abc**    | curl jq git wget unzip zip         |  /  |  +  | common utilities                                               |
|            | .ssh                               |  +  |  +  | Basic .ssh configuration (no keys)                             |
|            |                                    |     |     |                                                                |
| **az**     | az cli                             |  /  |  +  |                                                                |
|            |                                    |     |     |                                                                |
| **fzf**    | fuzzy find                         |  +  |  +  | https://github.com/junegunn/fzf                                |
|            |                                    |     |     |                                                                |
| **git**    | git configuration                  |  +  |  +  | Notable laiases:<br/>`git-squash-branch`, `git-cleanup`        |
|            |                                    |     |     |                                                                |
| **k8s**    | kubectl                            |  /  |  +  |                                                                |
|            | krew plugin manager                |  +  |  +  | https://krew.sigs.k8s.io                                       |
|            | krew ctx ns                        |  +  |  +  | https://github.com/ahmetb/kubectx                              |
|            | krew iexec                         |  +  |  +  | https://github.com/gabeduke/kubectl-iexec                      |
|            | krew images                        |  +  |  +  | https://github.com/chenjiandongx/kubectl-images                |
|            | krew kuttl                         |  +  |  +  | https://kuttl.dev/                                             |
|            | krew tree                          |  +  |  +  | https://github.com/ahmetb/kubectl-tree                         |
|            | k9s                                |  +  |  +  | https://k9scli.io/                                             |
|            |                                    |     |     |                                                                |
| **python** | pip3                               |  /  |  +  |                                                                |
|            | tldr                               |  +  |  +  | https://github.com/tldr-pages/tldr                             |
|            |                                    |     |     |                                                                |
| **utils**  | jless                              |  +  |  +  |                                                                |
|            | mc                                 |  -  |  +  |                                                                |
|            | duf                                |  -  |  +  |                                                                |
|            | btop                               |  -  |  +  |                                                                |
|            | neofetch                           |  -  |  +  |                                                                |
|            | ncdu                               |  -  |  +  |                                                                |
|            |                                    |     |     |                                                                |
| **zsh**    | aliases                            |  +  |  +  | ll, reload!                                                    |
|            | configured p10k omz theme          |  +  |  +  |                                                                |
|            | omz plugin sudo                    |  +  |  +  | https://github.com/ohmyzsh/ohmyzsh/tree/master/plugins/sudo    |
|            | omz plugin git                     |  +  |  +  | https://github.com/ohmyzsh/ohmyzsh/tree/master/plugins/git     |
|            | omz plugin kubectl                 |  +  |  +  | https://github.com/ohmyzsh/ohmyzsh/tree/master/plugins/kubectl |
|            |                                    |     |     |                                                                |
|            | omz plugin zsh-autosuggestions     |  +  |  +  |                                                                |
|            | omz plugin zsh-syntax-highlighting |  +  |  +  |                                                                |
|            | omz plugin zsh-completions         |  +  |  +  |                                                                |
|            |                                    |     |     |                                                                |

### Notes
Your dotfiles are how you personalize your system. These are mine.

I was a little tired of having long alias files and everything strewn about
(which is extremely common on other dotfiles projects, too). That led to this
project being much more topic-centric. I realized I could split a lot of things
up into the main areas I used (git, system libraries, and so on), so I
structured the project accordingly.
I've attempted to keep on using only the master branch and be smart on what environment I'm in.

If you're interested in the philosophy behind why projects like these are
awesome, you might want to [read Holman's post on the
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
[Fork holman's](https://github.com/holman/dotfiles/fork) or [Fork mine](htps://github.com/jldeen/dotfiles/fork), remove what you don't
use, and build on what you do use.

## components

There's a few special files in the hierarchy.

- **bin/**: Anything in `bin/` will get added to your `$PATH` and be made
  available everywhere.
- **Brewfile**: This is a list of applications for [Homebrew Cask](https://caskroom.github.io) to install: things like Chrome and 1Password and Adium and stuff. Might want to edit this file before running any initial setup.
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

## bugs

I want this to work for everyone; that means when you clone it down it should
work for you even though you may not have `rbenv` installed, for example. That
said, I do use this as *my* dotfiles, so there's a good chance I may break
something if I forget to make a check for a dependency.

If you're brand-new to the project and run into any blockers, please
[open an issue](https://github.com/jldeen/dotfiles/issues) on this repository,
and I'd love to get it fixed for you!
