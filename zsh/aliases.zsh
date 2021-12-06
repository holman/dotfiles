alias colourify="$commands[grc] -es --colour=auto"

alias reload!="exec $SHELL -l"
alias dotfiles="$EDITOR ~/.dotfiles"
alias dots="dotfiles"
alias edit="$EDITOR ."
alias hosts!="$EDITOR /etc/hosts"

alias gst="gss"
alias gbc="gcb"
alias gup="g up"

alias fw="pushd ~/Findaway"
alias proj="pushd ~/Projects"
alias icd="pushd ~/Library/Mobile\ Documents/com\~apple\~CloudDocs"

# List direcory contents
alias lsa='colourify ls -lah'
alias l='colourify ls -la'
alias ll='colourify ls -l'
alias la='colourify ls -lA'

# Pipe my public key to my clipboard.
alias pubkey="less ~/.ssh/id_rsa.pub | pbcopy | echo '=> Public key copied to pasteboard.'"

alias gclean="git checkout master && git branch --merged master | grep -v \"\* master\" | xargs -n 1 git branch -d"

alias ip='colourify ipconfig getifaddr en0'
alias pubip='colourify dig +short myip.opendns.com @resolver1.opendns.com'
alias uuid="uuidgen | tr -d '\n' | tr '[:upper:]' '[:lower:]'  | pbcopy && pbpaste && echo"

alias update='/Users/cwardzala/.dotfiles/bin/update.sh'
alias lscleanup="/System/Library/Frameworks/CoreServices.framework/Frameworks/LaunchServices.framework/Support/lsregister -kill -r -domain local -domain system -domain user && killall Finder"
alias urlencode='python -c "import sys, urllib as ul; print ul.quote_plus(sys.argv[1]);"'

alias did="vim +'normal Go' +'r!date' ~/did.txt"

alias server="npx http-server"

alias dl-video="yt-dlp $1"
alias dl-audio="yt-dlp $1"
