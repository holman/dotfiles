# grc overides for ls
#   Made possible through contributions from generous benefactors like
#   `brew install coreutils`
if $(gls &>/dev/null)
then
  alias ls="gls -F --color"
  alias l="gls -lAh --color"
  alias ll="gls -l --color"
  alias la='gls -A --color'
fi


# Pipe my public key to my clipboard.
alias pubkey="more ~/.ssh/id_rsa.pub | pbcopy | echo '=> Public key copied to pasteboard.'"
alias tmux="TERM=screen-256color-bce tmux"


alias dotfiles="atom ~/.dotfiles"
alias reload!='. ~/.zshrc'
alias vlc="/Applications/VLC.app/Contents/MacOS/VLC"
alias hosts="sudo nano /etc/hosts"


alias ..="cd .."
alias ...="cd ../.."

# Hub wrapper
#hub_path=$(which hub)
#if (( $+commands[hub] ))
#then
#  alias git=$hub_path
#fi

#Git log alias
alias glog="git log --graph --pretty=format:'%Cred%h%Creset %an: %s - %Creset %C(yellow)%d%Creset %Cgreen(%cr)%Creset' --abbrev-commit --date=relative"


#Eval the default docker machine env
alias dme='eval $(docker-machine env default)'

#Start the default docker machine env
alias dms='docker-machine start default || true && dme'

# Get docker container IP
alias dip="docker inspect --format '{{ .NetworkSettings.IPAddress }}'"

# Get docker container ports
alias dports="docker inspect --format '{{range \$p, \$conf := .NetworkSettings.Ports}} {{\$p}} -> {{(index \$conf 0).HostPort}} {{end}}'"

# Kill all running containers.
alias dkill='printf "\n>>> Killing all running containers\n\n" && docker kill $(docker ps -q)'

# Delete all stopped containers.
alias drm='printf "\n>>> Deleting stopped containers\n\n" && docker rm $(docker ps -a -q)'

# Delete all dangling images.
alias drmi='printf "\n>>> Deleting untagged images\n\n" && docker rmi $(docker images -q -f dangling=true)'

# Delete all images.
alias drmia='printf "\n>>> Deleting all images\n\n" && docker rmi -f $(docker images -a -q)'

# Delete all dangling volumes
alias drmv='printf "\n>>> Deleting dangling volumes\n\n" && docker volume rm $(docker volume ls -qf dangling=true)'


# Delete all volumes
alias drmva='printf "\n>>> Deleting all volumes\n\n" && docker volume rm $(docker volume ls -q)'


# Delete all stopped containers, untagged images and dangling volumes
alias dclean='drm || true && drmi || true && drmv'


# Delete all containers, all images and all volumes
alias dcleanall='dkill || true && drm || true && drmia || true && drmva'

alias gclean="git fetch -p && for branch in `git branch -vv | grep ': gone]' | awk '{print $1}'`; do git branch -D $branch; done"
