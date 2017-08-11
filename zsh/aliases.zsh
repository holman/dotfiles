alias reload!='. ~/.zshrc'

# various helpful aliases related to terminal commands
alias updatedb="sudo /usr/libexec/locate.updatedb"
alias sl="ls"                               # in case you spell it wrong it will still work
alias ll="ls -alh"                          # list all files, even the hidden ones
alias lf="du -sh"                           # display directory file size
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
# export EDITOR='subl'
# export SVN_EDITOR='subl'
# export VISUAL='subl'


alias startaemauthor="ttab -a iterm -t 'AEM Author' && cd ~/bin/tesla/aem-startup/author; java -Xmx1024M -Xmx1256M -Xdebug -Xnoagent -Djava.compiler=NONE -Xrunjdwp:transport=dt_socket,address=30303,server=y,suspend=n -jar aem6-author-p4502.jar -r local,author -gui; sleep 5s; exit;"
alias startaempublish="ttab -a iterm -t 'AEM Publisher' && cd ~/bin/tesla/aem-startup/publish; java -Xmx1024M -Xmx1256M -Xdebug -Xnoagent -Djava.compiler=NONE -Xrunjdwp:transport=dt_socket,address=30303,server=y,suspend=n -jar aem6-publish-p4503.jar -r local,author -gui; sleep 5s; exit;"
