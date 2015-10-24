alias colourify="$commands[grc] -es --colour=auto"

alias reload!=". ~/.zshrc"
alias dotfiles="$EDITOR ~/.dotfiles"
alias prezto="$EDITOR ~/.zprezto"
alias edit="$EDITOR ."
alias hosts!="$EDITOR /etc/hosts"

alias fw="~/Findaway"
alias proj="~/Projects"

# List direcory contents
alias lsa='colourify ls -lah'
alias l='colourify ls -la'
alias ll='colourify ls -l'
alias la='colourify ls -lA'

alias bower='noglob bower'

# Pipe my public key to my clipboard.
alias pubkey="more ~/.ssh/id_rsa.pub | pbcopy | echo '=> Public key copied to pasteboard.'"

# servers
alias deathstar='ssh cwardzala@192.168.1.103'
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

alias gst='gws'

alias ios="open /Applications/Xcode.app/Contents/Developer/Applications/iOS\ Simulator.app"

alias nwjs="/Applications/nwjs.app/Contents/MacOS/nwjs"

alias gclean="git checkout master && git branch --merged master | grep -v \"\* master\" | xargs -n 1 git branch -d"

alias ip='ipconfig getifaddr en0'
alias pubip='dig +short myip.opendns.com @resolver1.opendns.com'
