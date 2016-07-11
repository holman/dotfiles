alias reload!='. ~/.zshrc'

# various helpful aliases related to terminal commands
alias updatedb="sudo /usr/libexec/locate.updatedb"
alias sl="ls"                               # in case you spell it wrong it will still work
alias ll="ls -alh"                          # list all files, even the hidden ones
alias lf="du -sh"                           # display directory file size
alias htdocs="cd /Applications/MAMP/htdocs" # go to MAMP's htdocs folder
alias reload=". ~/.profile"                 # reload your bash profile
alias relaod=reload                         # in case you spell it wrong it will still work

# ssh into ritcheyfamily.com
alias rfam="ssh ritcheyer@crossingscommunity.com"

# Seek out and destroy all instances of MySQL and Apache
alias diemysql="killall mysqld"
alias apachedie="killall httpd"
alias apacherestart="sudo apachectl restart"
alias apachestart="sudo apachectl start"
alias apachestop="sudo apachectl stop"


# Opening Applications
# =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
alias st='open /Applications/SourceTree.app'


# Switching PHP versions
# =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
alias switch53="brew-php-switcher 53;php -v"
alias switch56="brew-php-switcher 56;php -v"


# editor of choice -- Follow tutorial here: https://www.sublimetext.com/docs/2/osx_command_line.html
# =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
export EDITOR='subl -w'
export SVN_EDITOR='subl -w'
export VISUAL='subl -w'
