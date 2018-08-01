alias colourify="$commands[grc] -es --colour=auto"

alias reload!="exec $SHELL -l"
alias dotfiles="$EDITOR ~/.dotfiles"
alias edit="$EDITOR ."
alias hosts!="$EDITOR /etc/hosts"

alias gst="gss"

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

# vagrant
alias v='vagrant'
alias vst='vagrant status'
alias vu='vagrant up'
alias vup='vu'
alias vd='vagrant destroy'
alias vd!='vagrant destroy -f'
alias vh='vagrant halt'
alias vh!='vagrant halt -f'
alias vp='vagrant provision'
alias vr='vagrant reload'
alias vrp='vagrant reload --provision'
alias vssh='vagrant ssh'

# alias gst='gws'

alias nwjs="/Applications/nwjs.app/Contents/MacOS/nwjs"

alias gclean="git checkout master && git branch --merged master | grep -v \"\* master\" | xargs -n 1 git branch -d"

alias ip='colourify ipconfig getifaddr en0'
alias pubip='colourify dig +short myip.opendns.com @resolver1.opendns.com'
alias uuid="uuidgen | tr -d '\n' | tr '[:upper:]' '[:lower:]'  | pbcopy && pbpaste && echo"

alias update='/Users/cwardzala/.dotfiles/bin/update.sh'
alias lscleanup="/System/Library/Frameworks/CoreServices.framework/Frameworks/LaunchServices.framework/Support/lsregister -kill -r -domain local -domain system -domain user && killall Finder"
alias urlencode='python -c "import sys, urllib as ul; print ul.quote_plus(sys.argv[1]);"'

# Show/hide hidden files in Finder
alias show="defaults write com.apple.finder AppleShowAllFiles -bool true && killall Finder"
alias hide="defaults write com.apple.finder AppleShowAllFiles -bool false && killall Finder"

alias chrome="/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome"

alias did="vim +'normal Go' +'r!date' ~/did.txt"
