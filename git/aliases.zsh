# The rest of my fun git aliases
alias glog="git log --graph --pretty=format:'%Cred%h%Creset %an: %s - %Creset %C(yellow)%d%Creset %Cgreen(%cr)%Creset' --abbrev-commit --date=relative"
# learn git by status. will teach you the day to day.
alias gits="git status"
# diff unstage changes
alias gitd="git diff"
# diff staged changes
alias gitds="git diff --cached"
# commit and enter vim for message
alias gitc="git commit -a"
# commit with one-liner
alias gitcm="git commit -am"
# show branches
alias gitb="git branch"
# show all branches
alias gitba="git branch -a"
# delete branch
alias gitbd="git branch -d"
# switch branches
alias sw="git checkout"
# create branch
alias swb="git checkout -b"

