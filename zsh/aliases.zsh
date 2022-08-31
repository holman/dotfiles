alias reload!='. ~/.zshrc'

alias cls='clear' # Good 'ol Clear Screen command

########################
### Ported from Old Repo
#########################

### General
alias cat-old='/bin/cat '
alias cat='bat '

# Enable aliases to be sudo’ed
alias sudo='sudo '

# Stopwatch
alias timer='echo "Timer started. Stop with Ctrl-D." && date && time cat && date'

# Todo
alias t='todo.sh'

# Tree
alias tree='tree -a -I .git'

# Print each PATH entry on a separate line
alias path='echo -e ${PATH//:/\\n}'

### IP Stuff

# IP addresses
alias my_ip4_external="dig TXT +short -4 o-o.myaddr.l.google.com @ns1.google.com | awk -F'\"' '{ print \$2}'"
alias my_ip6_external="dig TXT +short -6 o-o.myaddr.l.google.com @ns1.google.com | awk -F'\"' '{ print \$2}'"

# List local ones
# alias my_ip="ifconfig en0 | grep inet | grep -v inet6 | cut -d ' ' -f2"
alias my_ip_local="ipconfig getifaddr en0"
alias my_ips="ifconfig | grep \"inet \" | grep -Fv 127.0.0.1 | awk '{print \$2}'"

# List all ips
alias my_ip_all="ifconfig -a | grep -o 'inet6\? \(addr:\)\?\s\?\(\(\([0-9]\+\.\)\{3\}[0-9]\+\)\|[a-fA-F0-9:]\+\)' | awk '{ sub(/inet6? (addr:)? ?/, \"\"); print }'"

# show open ports
alias my_open_ports="nmap -Pn \$(my_ip_local)" #"echo 'nmap -Pn \$(my_ip)'"

# Show active network interfaces
alias my_active_network_interfaces="ifconfig | pcregrep -M -o '^[^\t:]+:([^\n]|\n\t)*status: active'"
