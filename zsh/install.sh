sudo sh -c 'echo "$(brew --prefix zsh)/bin/zsh" >> /etc/shells'
chsh -s $(brew --prefix zsh)/bin/zsh
