alias reload!='. ~/.zshrc'

alias cls='clear' # Good 'ol Clear Screen command

# General
alias vi="vim"
alias hist='history | grep $1' #Requires one input
alias home='cd ~'

# Alias to multiple ls commands
alias ls='ls --color'
alias la='ls -Al'               # show hidden files
alias lx='ls -lXB'              # sort by extension
alias lk='ls -lSr'              # sort by size
alias lc='ls -lcr'              # sort by change time
alias lu='ls -lur'              # sort by access time
alias lr='ls -lR'               # recursive ls
alias lt='ls -ltr'              # sort by date
alias lm='ls -al |more'         # pipe through 'more'

# Alias chmod commands
alias mx='chmod a+x'
alias 000='chmod 000'
alias 644='chmod 644'
alias 755='chmod 755'

# Arch specific
alias pacup='sudo pacman -Syu && cower -uv'
