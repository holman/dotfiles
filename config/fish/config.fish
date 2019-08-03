source /usr/local/opt/asdf/asdf.fish

# The next line updates PATH for the Google Cloud SDK.
if [ -f '/Users/troy/Downloads/google-cloud-sdk/path.fish.inc' ]; . '/Users/troy/Downloads/google-cloud-sdk/path.fish.inc'; end

# tabtab source for serverless package
# uninstall by removing these lines or running `tabtab uninstall serverless`
[ -f /Users/troy/.asdf/installs/nodejs/10.15.1/.npm/lib/node_modules/serverless/node_modules/tabtab/.completions/serverless.fish ]; and . /Users/troy/.asdf/installs/nodejs/10.15.1/.npm/lib/node_modules/serverless/node_modules/tabtab/.completions/serverless.fish
# tabtab source for sls package
# uninstall by removing these lines or running `tabtab uninstall sls`
[ -f /Users/troy/.asdf/installs/nodejs/10.15.1/.npm/lib/node_modules/serverless/node_modules/tabtab/.completions/sls.fish ]; and . /Users/troy/.asdf/installs/nodejs/10.15.1/.npm/lib/node_modules/serverless/node_modules/tabtab/.completions/sls.fish
# tabtab source for slss package
# uninstall by removing these lines or running `tabtab uninstall slss`
[ -f /Users/troy/.asdf/installs/nodejs/10.15.1/.npm/lib/node_modules/serverless/node_modules/tabtab/.completions/slss.fish ]; and . /Users/troy/.asdf/installs/nodejs/10.15.1/.npm/lib/node_modules/serverless/node_modules/tabtab/.completions/slss.fish

# Turn on VI mode
fish_vi_key_bindings
