# holman does dotfiles

## dotfiles

Your dotfiles are how you personalize your system. These are mine. The very prejudiced mix: OS X, zsh, Ruby, Rails, git, homebrew, rvm, TextMate. If you match up along most of those lines, you may dig my dotfiles.

I was a little tired of having long alias files and everything strewn about (which is extremely common on other dotfiles projects, too). That led to this project being much more topic-centric. I realized I could split a lot of things up into the main areas I used (Ruby, git, system libraries, and so on), so I structured the project accordingly.

## install

- `git clone git://github.com/holman/dotfiles ~/.dotfiles`
- `cd ~/.dotfiles`
- `rake install`

The install rake task will symlink the appropriate files in `.dotfiles` to your home directory. Everything is configured and tweaked within `~/.dotfiles`, though.

The main file you'll want to change right off the bat is `zsh/zshrc.symlink`, which sets up a few paths that'll be different on your particular machine.

## show me

<img src="http://cl.ly/1Q39/content" />

This shows a simple session. I keep my prompts pretty simple: the current Ruby I'm running, the current directory I'm in, and the branch and status of git if the directory I'm in is a git repo.

## topical

Everything's built around topic areas. If you're adding a new area to your forked dotfiles — say, "Java" — you can simply add a `java` directory and put files in there. Anything with an extension of `.zsh` will get automatically included into your shell. Anything with an extension of `.symlink` will get symlinked without extension into `$HOME` when you run `rake install`.

## what's inside

A lot of what's inside is just aliases: `gs` for `git status`, `gl` for `git pull --rebase --prune`, for example. You can browse the `aliases.zsh` files in each topic directory. There's also a collection of scripts in `bin` you can browse. A few notable ones:

###rails
- `s` pings your system for any running Rails apps, and `deathss` will then kill all of them indiscriminately. `ss` starts up a new Rails server on the next available port- if 3000 is taken, it'll spin up your server on 3001.

###system
- `c` is an autocomplete shortcut to your projects directory. For example, `c git` and then hitting tab will autocomplete to `github`, and then it simply changes to my `github` directory.
- `check [filename]` is a quick script that tells you whether a domain is available to register.
- `smartextract [filename]` will extract about a billion different compressed/uncompressed/whatever files.

##moar custom
There are a few things I use to make my life awesome. They're not a required dependency, but if you make it happen, THEY'LL MAKE **YOU** HAPPEN.

- If you want some more colors for things like `ls`, install grc: `brew install grc`.
- If you install the excellent [rvm](http://rvm.beginrescueend.com) to manage multiple rubies, your current branch will show up in the prompt. Bonus.

## thanks

I forked [Ryan Bates](http://github.com/ryanb)' excellent [dotfiles](http://github.com/ryanb/dotfiles) for a couple years before the weight of my changes and tweaks inspired me to finally roll my own. But Ryan's dotfiles were an easy way to get into bash customization, and then to jump ship to zsh a bit later. A decent amount of the code in these dotfiles stem or are inspired from Ryan's original project.