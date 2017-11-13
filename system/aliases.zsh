# grc overides for ls
#   Made possible through contributions from generous benefactors like
#   `brew install coreutils`
if $(gls &>/dev/null)
then
  alias ls="gls -F --color"
  alias l="gls -lAh --color"
  alias ll="gls -l --color"
  alias la='gls -A --color'
fi

# Flush the OS X DNS cache
# @link https://support.apple.com/en-us/HT202516
alias flush='sudo killall -HUP mDNSResponder'

# Add an alias for Homestead
# @see https://laravel.com/docs/5.2/homestead#daily-usage
alias homestead='function __homestead() { (cd ~/Homestead && vagrant $*); unset -f __homestead; }; __homestead'

# Launch homestead and ssh into the box
alias work='homestead up && homestead ssh'

# An alias for the Behat testing framework
alias behat='vendor/bin/behat'

# An alias for the phpspec testing framework
alias phpspec='vendor/bin/phpspec'

# Composer aliases
alias cda='composer dump-autoload'

# Artisan aliases
alias a='php artisan'
alias al='php artisan list'
