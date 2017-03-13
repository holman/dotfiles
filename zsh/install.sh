sudo sh -c 'echo "$(brew --prefix zsh)/bin/zsh" >> /etc/shells'
sudo chsh -s $(brew --prefix zsh)/bin/zsh
