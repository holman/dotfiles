# Install YADR
▾sh -c "`curl -fsSL https://raw.githubusercontent.com/skwp/dotfiles/master/install.sh`" -s ask
pushd ~/.yadr
git pull --rebase
rake update
popd

# Create a Projects directory
# This is a default directory for macOS user accounts but doesn't comes pre-installed
mkdir -p $HOME/Projects


