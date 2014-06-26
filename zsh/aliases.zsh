alias colourify='$commands[grc] -es --colour=auto'

alias reload!='. ~/.zshrc'
alias zshconfig="subl ~/.zshrc"
alias prezto='subl ~/.zprezto'

alias edit="subl ."

alias fww="~/Findawayworld"
alias proj="~/Projects"

# List direcory contents
alias lsa='colourify ls -lah'
alias l='colourify ls -la'
alias ll='colourify ls -l'
alias la='colourify ls -lA'

alias bower='noglob bower'

# Pipe my public key to my clipboard.
alias pubkey="more ~/.ssh/id_rsa.pub | pbcopy | echo '=> Public key copied to pasteboard.'"

# SSH aliases
alias appserver1='ssh cwardzala@10.217.43.6'
alias appserver2='ssh cwardzala@10.217.43.7'
alias appserver3='ssh cwardzala@10.217.43.8'

alias fa1='ssh fwdeploy@10.217.43.6'
alias fa2='ssh fwdeploy@10.217.43.7'
alias fa3='ssh fwdeploy@10.217.43.8'

alias webhost1='ssh cwardzala@10.217.43.15'
alias fury='ssh cwardzala@172.29.16.89'

alias deathstar='ssh cwardzala@192.168.1.103'
alias rpi='ssh cam@192.168.1.122'

# vagrant
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

alias hosts!='$EDITOR /etc/hosts'

alias gst='gws'

alias ios="open /Applications/Xcode.app/Contents/Developer/Platforms/iPhoneSimulator.platform/Developer/Applications/iPhone\ Simulator.app"
