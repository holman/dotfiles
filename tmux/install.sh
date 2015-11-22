#!bin/bash
if [ "$(uname)" == "Darwin" ]; then
  brew install tmux
elif [[ "$(lsb_release -i)" == *"Ubuntu"* ]]; then
  sudo apt-get install -y tmux
fi
