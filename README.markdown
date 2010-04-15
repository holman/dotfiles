# holman does dotfiles

## dotfiles

Your dotfiles are how you personalize your system. These are mine. The very prejudiced mix: OS X, zsh, Ruby, Rails, git, homebrew, TextMate. If you match up along most of those lines, you may dig my dotfiles.

I was a little tired of having long alias files and everything strewn about (which is extremely common on other dotfiles projects, too). That led to this project being much more topic-centric. I realized I could split a lot of things up into the main areas I used (Ruby, git, system libraries, and so on), so I structured the project accordingly.

## dependencies

- [Homebrew](http://github.com/mxcl/homebrew)
- grc (`brew install grc`)

## install

- `git clone git://github.com/holman/dotfiles ~/.dotfiles`
- `cd ~/.dotfiles`
- `rake install`

The install rake task will symlink the appropriate files in `.dotfiles` to your home directory. Everything in configured and tweaked within `~/.dotfiles`, though.

## what's inside

I don't know. Quit asking questions.

Really though, I'll write up an overview in a bit. CHILL ALREADY JEEZ.

## thanks

I forked [Ryan Bates](http://github.com/ryanb)' excellent [dotfiles](http://github.com/ryanb/dotfiles) for a couple years before the weight of my changes and tweaks inspired me to finally roll my own. But Ryan's dotfiles were an easy way to get into bash customization, and then to jump ship to zsh a bit later. A decent amount of the code in these dotfiles stem or are inspired from Ryan's original project.