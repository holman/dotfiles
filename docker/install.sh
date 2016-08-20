mkdir -p ~/.zsh/completion
curl -L https://raw.githubusercontent.com/docker/compose/$(docker-compose version --short)/contrib/completion/zsh/_docker-compose > completion.zsh
