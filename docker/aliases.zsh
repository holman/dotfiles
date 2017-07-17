#Eval the default docker machine env
alias dme='eval $(docker-machine env default)'

# Get docker container IP
alias dip="docker inspect --format '{{ .NetworkSettings.IPAddress }}'"

# Get docker container ports
alias dports="docker inspect --format '{{range \$p, \$conf := .NetworkSettings.Ports}} {{\$p}} -> {{(index \$conf 0).HostPort}} {{end}}'"

# Kill all running containers.
alias dkill='docker kill $(docker ps -q)'

# Delete all stopped containers.
alias drm='printf "\n>>> Deleting stopped containers\n\n" && docker rm $(docker ps -a -q)'

# Delete all dangling images.
alias drmi='printf "\n>>> Deleting untagged images\n\n" && docker rmi $(docker images -q -f dangling=true)'

# Delete all images.
alias drmia='printf "\n>>> Deleting all images\n\n" && docker rmi $(docker images -a -q)'

# Delete all dangling volumes
alias drmv='printf "\n>>> Deleting dangling volumes\n\n" && docker volume rm $(docker volume ls -qf dangling=true)'


# Delete all volumes
alias drmv='printf "\n>>> Deleting all volumes\n\n" && docker volume rm $(docker volume ls -q)'


# Delete all stopped containers, untagged images and dangling volumes
alias dclean='drm || true && drmi || true && drmv'


# Delete all containers, all images and all volumes
alias dcleanall='dkill || true && drm || true && drmia || true && drmva'
