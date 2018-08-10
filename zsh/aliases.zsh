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

# List direcory contents
alias lsa='colourify ls -lah'
alias l='colourify ls -la'
alias ll='colourify ls -l'
alias la='colourify ls -lA'

# Pipe my public key to my clipboard.
alias pubkey="less ~/.ssh/id_rsa.pub | pbcopy | echo '=> Public key copied to pasteboard.'"

# servers
alias buildbox='ssh ubuntu@ec2-54-172-90-220.compute-1.amazonaws.com'

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

