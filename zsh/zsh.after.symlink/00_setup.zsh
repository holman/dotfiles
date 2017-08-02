# Path to your dotfiles installation.
export DOTFILES=$HOME/.dotfiles

# You may need to manually set your language environment
export LC_ALL=en_US.UTF-8
export LANG=en_US.UTF-8

# Preferred editor for local and remote sessions
if [[ -n $SSH_CONNECTION ]]; then
  export EDITOR='vim'
else
  export EDITOR='mvim'
fi

# Set the Zsh modules to load (man zshmodules).
# zstyle ':prezt
zstyle ':prezto:load' pmodule \
  'node'\
  'tmux'

zstyle ':prezto:module:tmux:auto-start' local 'yes'
zstyle ':prezto:module:tmux:auto-start' remote 'yes'

# SSH
# export SSH_KEY_PATH="~/.ssh/dsa_id"

# shortcut to this dotfiles path is $ZSH
export ZSH=$HOME/.dotfiles

# your project folder that we can `c [tab]` to
export PROJECTS=~/Projects

# Stash your environment variables in ~/.localrc. This means they'll stay out
# of your main dotfiles repository (which may be public, like this one), but
# you'll have access to them in your scripts.
if [[ -a ~/.localrc ]]
then
  source ~/.localrc
fi

# all of our zsh files
typeset -U config_files
config_files=($ZSH/**/*.zsh)

# load the path files
for file in ${(M)config_files:#*/path.zsh}
do
  source $file
done

# load the alias files
for file in ${(M)config_files:#*/alias.zsh}
do
  echo "sourcing $file"
  source $file
done

# load everything but the path and completion files
#for file in ${${config_files:#*/path.zsh}:#*/completion.zsh}
#do
#  source $file
#done

# initialize autocomplete here, otherwise functions won't be loaded
#autoload -U compinit
#compinit

# load every completion after autocomplete loads
#for file in ${(M)config_files:#*/completion.zsh}
#do
#  source $file
#done

unset config_files
