if [[ -d "$HOME/.okta/bin" && ":$PATH:" != *":$HOME/.okta/bin:"* ]]; then
  export PATH="$HOME/.okta/bin:$PATH"
fi
