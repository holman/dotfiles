# Path configuration
# The order matters! Earlier paths take precedence

# Homebrew paths (Apple Silicon)
if [[ -d "/opt/homebrew" ]]; then
    export PATH="/opt/homebrew/bin:$PATH"
    export PATH="/opt/homebrew/sbin:$PATH"

    # GNU utils from Homebrew
    if [[ -d "$(brew --prefix coreutils)" ]]; then
        export PATH="$(brew --prefix coreutils)/libexec/gnubin:$PATH"
    fi
    if [[ -d "$(brew --prefix grep)" ]]; then
        export PATH="$(brew --prefix grep)/libexec/gnubin:$PATH"
    fi
fi

# Local binaries
export PATH="/usr/local/bin:$PATH"
export PATH="/usr/local/sbin:$PATH"

# Dotfiles binaries and functions
export PATH="$HOME/.dotfiles/bin:$PATH"
export PATH="$HOME/.dotfiles/functions:$PATH"

# Node.js related paths
if [[ -d "$HOME/.yarn" ]]; then
    export PATH="$HOME/.yarn/bin:$PATH"
fi
if [[ -d "/usr/local/share/npm" ]]; then
    export PATH="/usr/local/share/npm/bin:$PATH"
fi

# System paths (should be last as fallback)
export PATH="$PATH:/usr/bin"
export PATH="$PATH:/usr/sbin"
export PATH="$PATH:/bin"
export PATH="$PATH:/sbin"
