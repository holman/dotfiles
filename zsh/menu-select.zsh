
# Initialize completion
zstyle ':completion::complete:*' use-cache 1
zstyle ':completion::complete:*' cache-path $ZSH_CACHE

# Enable approximate completions
zstyle ':completion:*' completer _complete _ignored _approximate
zstyle -e ':completion:*:approximate:*' max-errors 'reply=($((($#PREFIX+$#SUFFIX)/3)) numeric)'

# Automatically update PATH entries
zstyle ':completion:*' rehash true

# Use menu completion
zstyle ':completion:*' menu select

# Verbose completion results
zstyle ':completion:*' verbose true

# Smart matching of dashed values, e.g. f-b matching foo-bar
zstyle ':completion:*' matcher-list 'r:|[._-]=* r:|=*'

# Group results by category
zstyle ':completion:*' group-name ''

# Don't insert a literal tab when trying to complete in an empty buffer
zstyle ':completion:*' insert-tab false

# Keep directories and files separated
zstyle ':completion:*' list-dirs-first true

# Don't try parent path completion if the directories exist
zstyle ':completion:*' accept-exact-dirs true

# Always use menu selection for `cd -`
zstyle ':completion:*:*:cd:*:directory-stack' force-list always
zstyle ':completion:*:*:cd:*:directory-stack' menu yes select

# Pretty messages during pagination
zstyle ':completion:*' list-prompt '%SAt %p: Hit TAB for more, or the character to insert%s'
zstyle ':completion:*' select-prompt '%SScrolling active: current selection at %p%s'

# Nicer format for completion messages
zstyle ':completion:*:descriptions' format '%U%B%d%b%u'
zstyle ':completion:*:corrections' format '%U%F{green}%d (errors: %e)%f%u'
zstyle ':completion:*:warnings' format '%F{202}%BSorry, no matches for: %F{214}%d%b'

# Show message while waiting for completion
zstyle ':completion:*' show-completer true

# Prettier completion for processes
#zstyle ':completion:*:*:*:*:processes' force-list always
#zstyle ':completion:*:*:*:*:processes' menu yes select
#zstyle ':completion:*:*:*:*:processes' list-colors '=(#b) #([0-9]#) ([0-9a-z-]#)*=01;34=0=01'
#zstyle ':completion:*:*:*:*:processes' command "ps -u $USER -o pid,user,args -w -w"

# Use ls-colors for path completions
#function _set-list-colors() {
	zstyle ':completion:*' list-colors ${(s.:.)LS_COLORS}
#	unfunction _set-list-colors
#}
#sched 0 _set-list-colors  # deferred since LC_COLORS might not be available yet

# Don't complete hosts from /etc/hosts
zstyle -e ':completion:*' hosts 'reply=()'

# Don't complete uninteresting stuff unless we really want to.
zstyle ':completion:*:functions' ignored-patterns '(_*|pre(cmd|exec)|TRAP*)'
zstyle ':completion:*:*:*:users' ignored-patterns \
		adm amanda apache at avahi avahi-autoipd beaglidx bin cacti canna \
		clamav daemon dbus distcache dnsmasq dovecot fax ftp games gdm \
		gkrellmd gopher hacluster haldaemon halt hsqldb ident junkbust kdm \
		ldap lp mail mailman mailnull man messagebus mldonkey mysql nagios \
		named netdump news nfsnobody nobody nscd ntp nut nx obsrun openvpn \
		operator pcap polkitd postfix postgres privoxy pulse pvm quagga radvd \
		rpc rpcuser rpm rtkit scard shutdown squid sshd statd svn sync tftp \
		usbmux uucp vcsa wwwrun xfs cron mongodb nullmail portage redis \
		shoutcast tcpdump '_*'
zstyle ':completion:*' single-ignored show
