# general
alias vim='/usr/local/bin/mvim -v'
alias vi='vim'
alias ls='ls -GFh'

#alias for cnpm
alias cnpm="npm --registry=https://registry.npm.taobao.org \
  --cache=$HOME/.npm/.cache/cnpm \
  --disturl=https://npm.taobao.org/dist \
  --userconfig=$HOME/.cnpmrc"

alias set dc='docker-compose'
alias set dm='docker-machine'

# python
alias jnl='jupyter notebook list'
alias jn='jupyter notebook'

# git
# alias gcianoe ='git commit  --no-edit --amend'
alias gciae='git commit --amend -m'


# remote SSH
alias sjump='ssh -i ~/.ssh/changxin.cheng.private_key -p 2222 10.128.253.29'
alias devdb='mysql -upxc_test -paySu0myNHkh -P3306 -h10.125.252.77'
alias cdb='cqlsh.py 10.125.235.51 9042'
