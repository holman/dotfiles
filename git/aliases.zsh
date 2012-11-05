# Use `hub` as our git wrapper:
#   http://defunkt.github.com/hub/
hub_path=$(which hub)
if [[ -f $hub_path ]]
then
  alias git=$hub_path
fi

alias gb='git branch'
alias gbav='gb -avv'
alias gc='git commit'
alias gca='git commit -a'
alias gco='git checkout'
alias gd='git diff'
alias gl='git pull --prune'
alias glod='git log --oneline --decorate --graph --abbrev-commit --date=relative'
alias glog="git log --graph --pretty=format:'%Cred%h%Creset %an: %s - %Creset %C(yellow)%d%Creset %Cgreen(%cr)%Creset' --abbrev-commit --date=relative"
alias gp='git push origin HEAD'
# alias grm="git status | grep deleted | awk '{print \$3}' | xargs git rm"
alias grm='git status -s | awk '\''/^ D/{for (i=2; i<=NF; i++) { printf("%s ", $i)} printf("\n")}'\'' | xargs git rm'
alias gs='git status -sb'
alias gsbn='git log --name-only | grep -v "^ " | grep \.rb$ | sort | uniq -c | sort -nr'
alias gitrank='git shortlog -sn'
