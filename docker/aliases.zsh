#Eval the default docker machine env
alias dme="eval $(docker-machine env default)"

# Get docker
alias dip="docker inspect --format '{{ .NetworkSettings.IPAddress }}'"

# Kill all running containers.
alias dkill='docker kill $(docker ps -q)'

# Delete all stopped containers.
alias drm='printf "\n>>> Deleting stopped containers\n\n" && docker rm $(docker ps -a -q)'

# Delete all untagged images.
alias drmi='printf "\n>>> Deleting untagged images\n\n" && docker rmi $(docker images -q -f dangling=true)'

# Delete all dangling volumes
alias drmv='printf "\n>>> Deleting dangling volumes\n\n" && docker volume rm $(docker volume ls -qf dangling=true)'

# Delete all stopped containers and untagged images.
alias dclean='drm || true && drmi || true && drmv'
