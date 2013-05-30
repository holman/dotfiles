# du aliases
alias size-sys='sudo du -hsc /Applications /bin /Library /private/tmp /private/var /private/etc /System /usr /.Spotlight-V100 | du_sort_'
alias size-total='du_d1 /'
alias size-sys-lib='du_d1 /Library'
alias size-apps='du_d1 /Applications'
alias size-sys-system='du_d1 /System'
alias size-users='du_d1 /Users'
alias size-home='du_d1 $HOME'
alias size-home-lib='du_d1 $HOME/Library'
alias size-home-music='du_d1 $HOME/Music/iTunes/iTunes\ Music'
alias disk-left='sudo df -h'

du_d1() {
  echo "Computing size of $1"
  sudo du -hx -d 1 "$1" | du_sort_
}

du_sort_() {
  perl -e '%byte_order = ( G => -3, M => -2, K => -1, k => -1); print map { $_->[0] } sort { $byte_order{$a->[1]} <=> $byte_order{$b->[1]} || $b->[2] <=> $a->[2] } map { [ $_, /([MGK])/, /(\d+)/ ] } <>'
}
