# Add .local/ to PATH
if test "$(uname)" = "Darwin"
then
else
    export JUPYTER_RUNTIME_DIR="$HOME/.jupyter/runtime"
    export PATH="$HOME/.local/bin/:$PATH"
fi
