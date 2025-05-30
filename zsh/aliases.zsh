# Add color support to commands using grc
alias colourify="$commands[grc] -es --colour=auto"

# Shell and editor commands
alias reload!="exec $SHELL -l"              # Reload the shell (i.e. invoke as a login shell)
alias dotfiles="$EDITOR ~/.dotfiles"        # Open dotfiles in editor
alias dots="dotfiles"                       # Short alias for dotfiles
alias edit="$EDITOR ."                      # Open current directory in editor
alias hosts!="$EDITOR /etc/hosts"           # Edit hosts file

# Directory navigation
alias proj="pushd ~/Projects"               # Navigate to Projects directory, saving current directory
alias icd="pushd ~/Library/Mobile\ Documents/com\~apple\~CloudDocs"  # Navigate to iCloud directory
alias fw="proj"                             # Alternative for Projects directory (legacy 'framework' alias)

# Development tools
alias mcc="mvn clean compile"               # Clean and compile Maven project

# Modern directory listing with eza
alias ls='eza --icons --group-directories-first'                                           # Modern ls with icons
alias lsa='eza -la --icons --no-user --group-directories-first  --time-style long-iso'    # List all files, including hidden
alias ll='eza -l --icons --no-user --group-directories-first  --time-style long-iso'      # Long listing format

# SSH and security
alias pubkey="less ~/.ssh/id_rsa.pub | pbcopy | echo '=> Public key copied to pasteboard.'"  # Copy SSH public key to clipboard

# Git commands
alias gclean='git branch --merged main | grep -v "^\* main" | xargs -n 1 git branch -d'    # Delete all merged branches

# Network utilities
alias ip='colourify ipconfig getifaddr en0'                                                # Show local IP address
alias pubip='colourify dig +short myip.opendns.com @resolver1.opendns.com'                # Show public IP address
alias uuid="uuidgen | tr -d '\n' | tr '[:upper:]' '[:lower:]'  | pbcopy && pbpaste && echo"  # Generate and copy UUID

# System maintenance
alias lscleanup="/System/Library/Frameworks/CoreServices.framework/Frameworks/LaunchServices.framework/Support/lsregister -kill -r -domain local -domain system -domain user && killall Finder"  # Reset Launch Services database

# URL utilities
alias urlencode='python -c "import sys, urllib as ul; print ul.quote_plus(sys.argv[1]);"'  # URL encode a string

# Note taking
alias did="vim +'normal Go' +'r!date' ~/did.txt"                                          # Add dated entry to did.txt file

# Development servers
alias server="npx http-server"                                                            # Start a simple HTTP server

# Document conversion
alias md-pdf="pandoc $1 --pdf-engine=xelatex -f gfm -V mainfont="Helvetica" -V monofont="Fira Code" -o $2"  # Convert markdown to PDF

# Media download functions
dl-video() {
  yt-dlp "$@"                              # Download video with yt-dlp
}
dl-audio() {
  yt-dlp -x --audio-format mp3 "$@"        # Download and extract audio as MP3
}

# Package management
p() {
  pnpm "$@"                                # Run pnpm commands
}
