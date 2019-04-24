function profile_it() {
timer=$(($(gdate +%s%N)/1000000))

"$@"

now=$(($(gdate +%s%N)/1000000))
elapsed=$(($now-$timer))
echo $elapsed":" "$@"
}
