# Thomas aliases
alias calias="vi ~/.aliases"
alias cconfig="vi ~/.zshrc"

alias crack1="~/rarcrack/rarcrack ~/rarcrack/workspace/ff.7z --type 7z --threads"
alias crack2="~/rarcrack/rarcrack ~/rarcrack/workspace/ff.7z --type 7z --threads"
alias runclub="dev && cd runclub/runclub-cli"

alias gs="git status"
alias gl="git log"
alias gcom="git checkout master"
alias gaa="git add ."
alias gc="git commit -m "
alias gp="git push"
alias nah="git reset --hard && git clean -df"

alias nginx.start='sudo launchctl load /Library/LaunchDaemons/homebrew.mxcl.nginx.plist'
alias nginx.stop='sudo launchctl unload /Library/LaunchDaemons/homebrew.mxcl.nginx.plist'
alias nginx.restart='nginx.stop && nginx.start'
alias php-fpm.start="launchctl load -w ~/Library/LaunchAgents/homebrew.mxcl.php56.plist"
alias php-fpm.stop="launchctl unload -w ~/Library/LaunchAgents/homebrew.mxcl.php56.plist"
alias php-fpm.restart='php-fpm.stop && php-fpm.start'
alias mysql.start="launchctl load -w ~/Library/LaunchAgents/homebrew.mxcl.mysql.plist"
alias mysql.stop="launchctl unload -w ~/Library/LaunchAgents/homebrew.mxcl.mysql.plist"
alias mysql.restart='mysql.stop && mysql.start'
alias nginx.logs.error='tail -250f /usr/local/etc/nginx/logs/error.log'
alias nginx.logs.access='tail -250f /usr/local/etc/nginx/logs/access.log'
alias nginx.logs.default.access='tail -250f /usr/local/etc/nginx/logs/default.access.log'
alias nginx.logs.default-ssl.access='tail -250f /usr/local/etc/nginx/logs/default-ssl.access.log'
alias nginx.logs.phpmyadmin.error='tail -250f /usr/local/etc/nginx/logs/phpmyadmin.error.log'
alias nginx.logs.phpmyadmin.access='tail -250f /usr/local/etc/nginx/logs/phpmyadmin.access.log'


alias router='dig | grep "SERVER: "'
alias ww="which"
# alias laratail="tail -f $(find /laravel/storage/logs | tail -n 1)"
