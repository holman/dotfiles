# Uses git's autocompletion for inner commands. Assumes an install of git's
# bash `git-completion` script at $completion below (this is where Homebrew
# tosses it, at least).
completion='$(brew --prefix)/share/zsh/site-functions/_git'

if test -f $completion
then
  source $completion
fi

completion='/usr/local/opt/git-extras/share/git-extras/git-extras-completion.zsh'
if test -f $completion
then
  # to load completions for brew git-extras
  # git delete-branch not working?
  source $completion
fi
