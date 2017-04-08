# du aliases
alias size-sys='sudo du -hsc /Applications /bin /Library /private/tmp /private/var /private/etc /System /usr /.Spotlight-V100 | du-sort'
alias size-total='du-d1 /'
alias size-sys-lib='du-d1 /Library'
alias size-apps='du-d1 /Applications'
alias size-sys-system='du-d1 /System'
alias size-users='du-d1 /Users'
alias size-home='du-d1 $HOME'
alias size-home-lib='du-d1 $HOME/Library'
alias size-home-music='du-d1 $HOME/Music/iTunes/iTunes\ Music'
alias disk-left='sudo df -h'

du-d1() {
  echo "Computing size of $1"
  sudo du -hx -d 1 "$1" | gsort -rh
}
