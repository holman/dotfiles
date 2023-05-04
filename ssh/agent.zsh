eval "$(ssh-agent -s)" > /dev/null

if [ -f "$HOME/.ssh/id_ed25519_mbh" ]; then
  ssh-add ~/.ssh/id_ed25519_mbh > /dev/null 2>&1
fi
