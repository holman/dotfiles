# Klopertung's dotfiles

This repository is a fork of Zach Holman's [dotfiles](https://github.com/holman/dotfiles).

This fork implements an *alternates* feature, which is inpired by Tim Byrne's
[yadm](https://github.com/TheLocehiliosan/yadm).

The *alternates* feature allows you to have different versions of a
configuration file, and based on the OS/setup you are  running, the appropriate
config file wil be linked.

In the following, *bootstrap* refers to script/bootstrap in this repository.

## Alternates
When  managing a set of files across different systems, it can be useful to
have an automated way of choosing an alternate version of a file for a
different operating system, host, or user.  bootstrap will automatically create a symbolic link to the appropriate version of a file, as long as you follow a specific naming convention.  bootstrap can detect files with names ending in:

    .symlink or .symlink__OS or .symlink__OS.HOSTNAME or .symlink__OS.HOSTNAME.USER

(If  it is hard to see, those are double underscores.)  If there are any 
files in a repository managed by bootstrap which match this naming convention,
symbolic links will be created for the most appropriate version.  This may best
be demonstrated by example. Assume the following files in a  repository
are managed by bootstrap:

         - $HOME/.dotfiles/example.txt.symlink
         - $HOME/.dotfiles/example.txt.symlink__Darwin
         - $HOME/.dotfiles/example.txt.symlink__Darwin.host1
         - $HOME/.dotfiles/example.txt.symlink__Darwin.host2
         - $HOME/.dotfiles/example.txt.symlink__Linux
         - $HOME/.dotfiles/example.txt.symlink__Linux.host1
         - $HOME/.dotfiles/example.txt.symlink__Linux.host2

If running on a Macbook named "host2", bootstrap will create a symbolic link
which looks like this:

       $HOME/.example.txt -> $HOME/.dotfiles/example.txt.symlink__Darwin.host2

However, on another Mackbook named "host3", bootstrap will create a symbolic
link which looks like this:

       $HOME/.example.txt -> $HOME/.dotfiles/example.txt.symlink__Darwin

Since the hostname doesn't match any of the managed files, the more generic
version is chosen.

If running on a Linux server named "host4", the link will be:

       $HOME/.example.txt -> $HOME/.dotfiles/example.txt.symlink__Linux

If running on a Solaris server, the link uses the default ".symlink" 
version:

       $HOME/.example.txt -> $HOME/.dotfiles/example.txt.symlink

If no ".symlink" version exists and no files match the current OS/HOSTNAME/USER,
 then no link will be created.


bootstrap also accepts the naming convention used by yadm(1):

              ## or ##OS or ##OS.HOSTNAME or ##OS.HOSTNAME.USER

So we can have:

         - $HOME/.dotfiles/example.txt##
         - $HOME/.dotfiles/example.txt##Darwin
         - ...

To enable the yadm naming convention, edit the bootstrap script by changing
'altname="default"' to 'altname="yadm" at the beginning of the bootstrap
script.

The only (minor) advantage of yadm naming is that it allows for shorter
filenames.


## Usage
    scrip/bootstrap [-a <altname>] [-l | h]
	   -a altname
          Use the alternate filename scheme <altname>.  For example,
       
                script/bootstrap -a yadm
      
         Normally, you should not mix naming conventions within the same
         repository, so passing an alternative naming scheme on the command
         line is useful mainly for testing purposes.

	   -l
	     Run only the linking part of the bootstrapping process.  Useful for
	     updating the symbolic links, e.g., after adding a new configuration file
	     to the repository.

       -h
            This message.


## Development
Currently, this fork's main development is to test and improve the *alternates*
feature.  This means the dotfiles you'll find here are mainly those of
Zack holman, unmodified.

## Install

Run this:


    git clone https://github.com/klopertung/dotfiles.git ~/.dotfiles
    cd ~/.dotfiles
    script/bootstrap


This will symlink the appropriate files in .dotfiles to your home directory.
Everything is configured and tweaked within ~/.dotfiles.

The main file you'll want to change right off the bat is zsh/zshrc.symlink,
which sets up a few paths that'll be different on your particular machine.

dot is a simple script that installs some dependencies, sets sane
OS X defaults, and so on. Tweak this script, and occasionally run dot from
time to time to keep your environment fresh and up-to-date. You can find this
script in bin/.

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
- **topic/\*.symlink**: Any files ending in `*.symlink` get symlinked into
  your `$HOME`. This is so you can keep all of those versioned in your dotfiles
  but still keep those autoloaded files in your home directory. These get
  symlinked in when you run `script/bootstrap`.
  

## See also:
yadm               - [https://github.com/TheLocehiliosan/yadm](https://github.com/TheLocehiliosan/yadm)

Holman dotfiles - [https://github.com/holman/dotfiles](://github.com/holman/dotfiles)
