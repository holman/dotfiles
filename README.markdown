# holman does dotfiles

## dotfiles

Your dotfiles are how you personalize your system. These are mine. The very prejudiced mix: OS X, zsh, Ruby, Rails, git, homebrew, TextMate. If you match up along most of those lines, you may dig my dotfiles.

I was a little tired of having long alias files and everything strewn about (which is extremely common on other dotfiles projects, too). That led to this project being much more topic-centric. I realized I could split a lot of things up into the main areas I used (Ruby, git, system libraries, and so on), so I structured the project accordingly.

## dependencies

- [Homebrew](http://github.com/mxcl/homebrew)
- grc (`brew install grc`, for pretty colors)
- hub (`brew install hub`, for github git sexing)

## install

- `git clone git://github.com/holman/dotfiles ~/.dotfiles`
- `cd ~/.dotfiles`
- `rake install`

The install rake task will symlink the appropriate files in `.dotfiles` to your home directory. Everything in configured and tweaked within `~/.dotfiles`, though.

## what's inside

A bunch of stuff. Here's a tiny snapshot of a simple git session:

<img src="http://cl.ly/WNz/content" />

Notice the simple directory display, the branch set on the right, the color and plus sign depicting the dirty status and the push status of your code, and the touching of Kevin Bacon.

Beyond that, some Ruby aliases, some git helper scripts, some system helper scripts.

If you're adding a new area to your forked repo — say, "Java" — you can simply add a `java` directory and put files in there. Anything with an extension of `.zsh` will get automatically included into your shell profile. If you want to add a file that gets symlinked into `$HOME`, look at `Rakefile` and see how I do it for things like `ruby/irbrc`, for example.

## thanks

I forked [Ryan Bates](http://github.com/ryanb)' excellent [dotfiles](http://github.com/ryanb/dotfiles) for a couple years before the weight of my changes and tweaks inspired me to finally roll my own. But Ryan's dotfiles were an easy way to get into bash customization, and then to jump ship to zsh a bit later. A decent amount of the code in these dotfiles stem or are inspired from Ryan's original project.