# instructions here: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli-macos?view=azure-cli-latest
if test $(which brew); then
  if test ! $(which az); then
    echo "  installing azure cli"
    brew install azure-cli
  fi
  az login
fi