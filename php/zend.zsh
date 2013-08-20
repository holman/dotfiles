alias zend:start='sudo zendctl.sh start-apache'
alias zend:stop='sudo zendctl.sh stop-apache'
alias zend:restart='sudo zendctl.sh restart-apache'
alias zend:log='tail -f /usr/local/zend/var/log/php.log'

export PATH=/usr/local/zend/bin:$PATH
# export DYLD_LIBRARY_PATH=/usr/local/zend/lib
