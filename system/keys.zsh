# Remove the hosts that I don't want to keep around- in this case, only
# keep the first couple hosts. Like a boss.
alias hosts="head -2 ~/.ssh/known_hosts | tail -2 > ~/.ssh/known_hosts"

# Pipe my public key to my clipboard. Fuck you, pay me.
alias pubkey="more ~/.ssh/id_dsa.public | pbcopy | echo '=> Public key copied to pasteboard.'"