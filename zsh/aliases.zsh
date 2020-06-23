alias colourify="$commands[grc] -es --colour=auto"

alias reload!="exec $SHELL -l"
alias dotfiles="$EDITOR ~/.dotfiles"
alias dots="dotfiles"
alias edit="$EDITOR ."
alias hosts!="$EDITOR /etc/hosts"

alias gst="gss"
alias gbc="gcb"

alias fw="~/Findaway"
alias proj="~/Projects"
alias icd="~/Library/Mobile\ Documents/com\~apple\~CloudDocs"

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

alias chrome="/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome"
alias android-studio="open -a /Applications/Android\ Studio.app/"

alias did="vim +'normal Go' +'r!date' ~/did.txt"

alias server="npx http-server"

alias homeserver="ssh cwardzala@192.168.68.144 -p 25705"
alias homeserver-public="ssh cwardzala@23.28.174.57 -p 25705"

alias dl-video="youtube-dl -f 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best' $1"
alias dl-audio="youtube-dl -f 'bestaudio[ext=m4a]/best' $1"
