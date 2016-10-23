export PATH="$(brew --prefix homebrew/php/php70)/bin:$PATH"
export PATH=~/.composer/vendor/bin:$PATH

# Load xdebug Zend extension with php command
alias php="php -dzend_extension=$(brew --prefix homebrew/php/php70-xdebug)/xdebug.so"
# PHPUnit needs xdebug for coverage. In this case, just make an alias with php command prefix.
alias phpunit='php ~/.composer/vendor/bin/phpunit'
