# Makes git auto completion faster favouring for local completions
__git_files () {
    _wanted files expl 'local files' _files
}

# Uses git's autocompletion for inner commands. Assumes an install of git's
# bash `git-completion` script at $completion below (this is where Homebrew
# tosses it, at least).
completion='$(brew --prefix)/share/zsh/site-functions/_git'

if test -f $completion
then
  source $completion
fi
