eval "$(ssh-agent -s)" > /dev/null

if [ -f "$HOME/.ssh/id_ed25519_mbh" ]; then
  ssh-add ~/.ssh/id_ed25519_mbh 1>/dev/null 2>&1
fi

if [ -f "$HOME/.ssh/id_ed25519" ]; then
  ssh-add ~/.ssh/id_ed25519 1>/dev/null 2>&1
fi
