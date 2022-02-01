if [[ -f "$HOME/.okta/bash_functions" ]]; then
  . "$HOME/.okta/bash_functions"
fi

if [[ -d "$HOME/.okta/bin" && ":$PATH:" != *":$HOME/.okta/bin:"* ]]; then
  PATH="$HOME/.okta/bin:$PATH"
fi

alias aws_login="aws_okta_keyman --duration 43200"
