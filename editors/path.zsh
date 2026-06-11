# Add the VS Code CLI (`code`) to PATH from the macOS app bundle, so it works
# even without running "Shell Command: Install 'code' command in PATH". This
# is what backs `git config core.editor "code --wait"`.
vscode_bin="/Applications/Visual Studio Code.app/Contents/Resources/app/bin"
if [[ -d "$vscode_bin" ]]; then
  export PATH="$vscode_bin:$PATH"
fi
unset vscode_bin
