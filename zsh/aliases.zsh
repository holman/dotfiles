alias reload!='. ~/.zshrc'

alias cls='clear' # Good 'ol Clear Screen command

########################
### Ported from Old Repo
#########################

### General

# Enable aliases to be sudo’ed
alias sudo='sudo '

# Stopwatch
alias timer='echo "Timer started. Stop with Ctrl-D." && date && time cat && date'

# Print each PATH entry on a separate line
alias path='echo -e ${PATH//:/\\n}'

### IP Stuff

# IP addresses

alias ip4_external="dig TXT +short -4 o-o.myaddr.l.google.com @ns1.google.com | awk -F'\"' '{ print \$2}'"
alias ip6_external="dig TXT +short -6 o-o.myaddr.l.google.com @ns1.google.com | awk -F'\"' '{ print \$2}'"

# List local ones
alias ip_local="ipconfig getifaddr en0"
alias ip_mine="ifconfig | grep \"inet \" | grep -Fv 127.0.0.1 | awk '{print \$2}'"

# List all ips
alias ip_all="ifconfig -a | grep -o 'inet6\? \(addr:\)\?\s\?\(\(\([0-9]\+\.\)\{3\}[0-9]\+\)\|[a-fA-F0-9:]\+\)' | awk '{ sub(/inet6? (addr:)? ?/, \"\"); print }'"

#alias my_ip="ifconfig en0 | grep inet | grep -v inet6 | cut -d ' ' -f2"
alias my_open_ports="nmap -Pn \$(my_ip)" #"echo 'nmap -Pn \$(my_ip)'"

# Show active network interfaces
alias ifactive="ifconfig | pcregrep -M -o '^[^\t:]+:([^\n]|\n\t)*status: active'"
