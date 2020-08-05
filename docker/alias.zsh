alias dockergc='docker run --rm --userns host -e REMOVE_VOLUMES=1 -v /var/run/docker.sock:/var/run/docker.sock -v /etc:/etc spotify/docker-gc'
