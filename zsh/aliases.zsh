alias reload!='. ~/.zshrc'

alias cls='clear' # Good 'ol Clear Screen command


## macOS specific aliases
if test "$(uname)" = "Darwin"; then
    ## Flush the DNS cache Mac OS X 10.7+
    alias flushdns='sudo killall -HUP mDNSResponder'

    alias copy='pbcopy'
    alias paste='pbpaste'
    alias desktop="cd $HOME/Desktop"
    alias download="cd $HOME/Downloads"
fi

## Laravel aliases
alias pa='php artisan'
alias pal='php artisan list'

alias yrd='yarn run dev'
alias yw='yarn run watch'

# https://superuser.com/a/975878/9551
alias brewski='brew update && brew upgrade && brew cleanup; brew doctor'
