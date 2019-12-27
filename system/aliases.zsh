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

# Add a function for Homestead
# @see https://laravel.com/docs/5.2/homestead#daily-usage
homestead() {
	(cd ~/Homestead && vagrant $*)
}

# Launch homestead
alias hu='homestead up'
alias hh='homestead halt'

# Launch homestead and ssh into the box
#alias work='homestead up && homestead ssh -- -t "cd Sites; /usr/bin/zsh"'
alias work='~/bin/work'

# An alias for the Behat testing framework
alias behat='vendor/bin/behat'

# An alias for the phpspec testing framework
alias phpspec='vendor/bin/phpspec'

# Composer aliases
alias cda='composer dump-autoload'

# Artisan aliases
alias a='php artisan'
alias al='php artisan list'

# http://calebporzio.com/bash-alias-composer-link-use-local-folders-as-composer-dependancies/
composer-link() {  
    composer config repositories.local '{"type": "path", "url": "'$1'"}' --file composer.json
}