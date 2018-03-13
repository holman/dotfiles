# Install Node Version Manager
export NVM_DIR="$HOME/.nvm" && (
  rm -rf "$NVM_DIR"
  git clone https://github.com/creationix/nvm.git "$NVM_DIR"
  cd "$NVM_DIR"
  git checkout `git describe --abbrev=0 --tags --match "v[0-9]*" origin`
)

echo "NVM installed successfully"

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm

# Set default node to be the one installed in the system
nvm alias default system


