if test $(which brew); then
  echo "   Installing asdf"
  brew install asdf

  asdf plugin-add nodejs
  asdf plugin-add python
  asdf plugin-add ruby
  asdf plugin-add golang
  asdf plugin-add yarn
  asdf plugin-add dotnet-core
  asdf plugin-add helm
  asdf plugin-add kubectl
  asdf plugin-add terraform
fi
