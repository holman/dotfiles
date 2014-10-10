# Load and configure zsh move function for easier renaming of files with
# patterns
autoload zmv
alias zmz='noglob zmv'
alias zcp='noglob zmv -C'
alias zln='noglob zmv -L'
alias zsy='noglob zmv -Ls'
