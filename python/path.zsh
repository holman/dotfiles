# Python and uv configuration
export UV_PYTHON_PREFERENCE=only-managed
export UV_COMPILE_BYTECODE=1

# Add uv-managed Python binaries to PATH
export PATH="$HOME/.local/bin:$PATH"

# Python development tools
export PYTHONDONTWRITEBYTECODE=1
export PYTHONUNBUFFERED=1