# Pipe my public key to my clipboard.
alias pubkey='xclip -sel clip < ~/.ssh/id_rsa.pub | echo "=> Key copied to clipboard."'