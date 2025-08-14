# Docker aliases
alias d='docker'
alias dc='docker-compose'
alias dps='docker ps'
alias di='docker images'
alias drmi='docker rmi'
alias dexec='docker exec -it'
alias dlogs='docker logs'
alias dstop='docker stop'
alias dstart='docker start'
alias drestart='docker restart'
alias dbuild='docker build'
alias drun='docker run'
alias drm='docker rm'

# Docker cleanup
alias docker-clean='docker system prune -f'
alias docker-clean-all='docker system prune -af'
alias docker-clean-volumes='docker volume prune -f'

# Docker Compose shortcuts
alias dcu='docker-compose up'
alias dcd='docker-compose down'
alias dcb='docker-compose build'
alias dcp='docker-compose ps'
alias dcl='docker-compose logs'
